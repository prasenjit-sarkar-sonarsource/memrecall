import { config } from './config';

// Initialize service worker
self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
});

// API configuration
const OPENAI_API_KEY = config.OPENAI_API_KEY;
const API_URL = config.API_URL;
const MODEL = config.MODEL;
const MAX_INPUT_TOKENS = config.MAX_INPUT_TOKENS;
const MAX_OUTPUT_TOKENS = config.MAX_OUTPUT_TOKENS;

const SUMMARY_PROMPTS = {
    concise: {
        system: "You are a helpful assistant that provides concise, well-structured summaries in markdown format. Focus on key points while maintaining clear hierarchy and formatting.",
        user: `Please provide a brief, focused summary in markdown format following this structure:

# [Main Title]

## Overview
Brief introduction (2-3 lines max)

## Key Points
- Major point 1
- Major point 2
- Major point 3

## Important Details
- Key detail 1
- Key detail 2

## Conclusion
Brief conclusion (1-2 lines max)

Keep the summary concise but ensure proper markdown formatting with clear headings and bullet points. Focus only on the most important information.`
    },
    detailed: {
        system: "You are a helpful assistant that provides comprehensive, detailed summaries in well-structured markdown format.",
        user: "Please provide a detailed summary including main points, supporting details, and analysis in markdown format. Use proper headings, subheadings, and maintain consistent formatting throughout the document."
    }
};

// Storage key generator
function getStorageKey(url, mode) {
    return `${url}_${mode}`;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "summarize") {
        (async () => {
            try {
                const tabs = await chrome.tabs.query({active: true, currentWindow: true});
                const tab = tabs[0];
                const url = tab.url;
                const mode = request.mode || 'detailed';
                const storageKey = getStorageKey(url, mode);

                // Check storage first
                const stored = await chrome.storage.local.get(storageKey);
                if (stored[storageKey]) {
                    console.log(`Found cached ${mode} summary`);
                    sendResponse(stored[storageKey]);
                    return;
                }

                // Get content from tab
                const tabContent = await new Promise((resolve) => {
                    chrome.tabs.sendMessage(tab.id, {action: "getContent"}, response => {
                        resolve(response || { error: "No response from content script" });
                    });
                });

                if (tabContent.error) {
                    throw new Error(tabContent.error);
                }

                if (!tabContent.content) {
                    throw new Error("No content could be extracted");
                }

                // Generate summary and store result
                const resultObj = await summarizeContent(tabContent.content, mode);
                
                // Add video ID and featured image if available
                resultObj.videoId = tabContent.videoId || null;
                resultObj.featuredImage = tabContent.featuredImage || null;

                // Store result
                await chrome.storage.local.set({[storageKey]: resultObj});
                
                console.log(`Stored new ${mode} summary with category:`, resultObj.contentType);
                sendResponse(resultObj);

            } catch (error) {
                console.error('Error in summarize handler:', error);
                sendResponse({
                    error: error.message || "An unknown error occurred"
                });
            }
        })();
        return true; 
    }
});

async function categorizeContent(data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content: `Analyze the content and respond with ONLY a simple JSON object like {"type":"Technology","subtype":"AI"}. Use broad types (Technology, Science, Entertainment, Education, News) and specific subtypes.`
                    },
                    {
                        role: "user",
                        content: `Title: ${data.title || ''}\nContent: ${data.content || ''}`
                    }
                ],
                temperature: 0.3,
                max_tokens: 50
            })
        });

        if (!response.ok) {
            return { type: 'Other', subtype: 'General' };
        }

        const result = await response.json();
        const content = result.choices[0]?.message?.content?.trim() || '';
        
        try {
            return JSON.parse(content);
        } catch {
            return { type: 'Other', subtype: 'General' };
        }
    } catch (error) {
        console.error('Categorization error:', error);
        return { type: 'Other', subtype: 'General' };
    }
}

async function extractKeywords(content, mode) {
    if (!content) {
        console.log('No content provided for keyword extraction');
        return [];
    }

    try {
        
        const cleanContent = content
            .substring(0, 4000)  
            .replace(/[^\w\s.,?!-]/g, ' ')  
            .replace(/\s+/g, ' ')  
            .trim();

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content: `Extract 5-10 key topics or concepts from the text as an array of keywords. Return ONLY a valid JSON array of strings, for example: ["keyword1", "keyword2"]. No explanation or other text needed.`
                    },
                    {
                        role: "user",
                        content: cleanContent
                    }
                ],
                temperature: 0.3,
                max_tokens: 150
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        const keywordContent = result.choices[0]?.message?.content?.trim() || '';

        
        try {
            
            const keywords = JSON.parse(keywordContent);
            if (Array.isArray(keywords)) {
                return keywords.filter(k => typeof k === 'string' && k.length > 0);
            }

            
            const arrayMatch = keywordContent.match(/\[(.*)\]/s);
            if (arrayMatch) {
                const arrayContent = arrayMatch[1];
                const keywordArray = JSON.parse(`[${arrayContent}]`);
                return Array.isArray(keywordArray) ? keywordArray.filter(k => typeof k === 'string' && k.length > 0) : [];
            }

            
            if (keywordContent.includes(',')) {
                return keywordContent
                    .split(',')
                    .map(k => k.trim().replace(/^["']|["']$/g, ''))
                    .filter(k => k.length > 0);
            }

            
            return keywordContent
                .split('\n')
                .map(line => line.trim().replace(/^[-*•\s"']+|["']+$/g, ''))
                .filter(k => k.length > 0);

        } catch (parseError) {
            console.error('Parsing error:', parseError);
            
            
            const fallbackKeywords = keywordContent.match(/["']([^"']+)["']|\s*[-*•]\s*([^,\n]+)/g) || [];
            return fallbackKeywords
                .map(k => k.trim().replace(/^[-*•\s"']+|["']+$/g, ''))
                .filter(k => k.length > 0);
        }
    } catch (error) {
        console.error('Keyword extraction error:', error);
        
        
        const words = new Set(
            content
                .split(/[\s.,!?()[\]{}"']+/)
                .filter(word => 
                    word.length > 4 && 
                    !['the', 'and', 'that', 'have', 'for', 'are'].includes(word.toLowerCase())
                )
        );
        return Array.from(words).slice(0, 10);
    }
}

async function summarizeContent(content, mode = 'detailed') {
    if (!content) {
        throw new Error('No content provided for summarization');
    }

    try {
        
        const summaryResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content: SUMMARY_PROMPTS[mode].system
                    },
                    {
                        role: "user",
                        content: `${SUMMARY_PROMPTS[mode].user}\n\n${content}`
                    }
                ],
                temperature: mode === 'concise' ? 0.3 : 0.7,
                max_tokens: MAX_OUTPUT_TOKENS
            })
        });

        if (!summaryResponse.ok) {
            throw new Error(`Summary API request failed with status ${summaryResponse.status}`);
        }

        const summaryResult = await summaryResponse.json();
        const summary = summaryResult.choices[0]?.message?.content || '';

        
        const keywords = await extractKeywords(content, mode);

        
        let categoryResult = { type: 'Other', subtype: 'General' };
        try {
            categoryResult = await categorizeContent({
                title: '', 
                content: content.substring(0, 2000),
                url: '' 
            });
        } catch (error) {
            console.error('Categorization error:', error);
        }

        
        const resultObj = {
            summary: summary,
            keywords: keywords,
            videoId: null, 
            featuredImage: null, 
            contentType: categoryResult,
            timestamp: Date.now(),
            mode: mode
        };

        return resultObj;
    } catch (error) {
        console.error('Error in summarization:', error);
        throw new Error(`Summarization failed: ${error.message}`);
    }
}


async function translateSummary(text, targetLanguage) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content: `You are a translator. Translate the following markdown text to ${targetLanguage}. Preserve all markdown formatting.`
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                max_tokens: MAX_OUTPUT_TOKENS
            })
        });

        if (!response.ok) {
            throw new Error(`Translation API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Translation error:', error);
        throw new Error(`Translation failed: ${error.message}`);
    }
}

async function saveSummary(summary) {
    try {
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        const url = tabs[0].url;
        await chrome.storage.local.set({
            [`summary_${url}`]: {
                content: summary,
                timestamp: Date.now()
            }
        });
    } catch (error) {
        console.error('Error saving summary:', error);
    }
}

async function clearSummaries(url) {
    try {
        await chrome.storage.local.remove([
            getStorageKey(url, 'concise'),
            getStorageKey(url, 'detailed')
        ]);
    } catch (error) {
        console.error('Error clearing summaries:', error);
    }
}
