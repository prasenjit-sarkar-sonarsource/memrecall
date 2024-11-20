// PDF.js library management
let pdfjsLib = null;
const PDF_CHUNK_SIZE = 10; // Number of pages to process at once

async function loadPdfJs() {
  if (pdfjsLib) return pdfjsLib;

  return new Promise((resolve, reject) => {
      // First, load the main PDF.js script
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('lib/pdf.min.js');
      
      script.onload = () => {
          // Initialize worker
          const workerScript = document.createElement('script');
          workerScript.src = chrome.runtime.getURL('lib/pdf.worker.min.js');
          
          workerScript.onload = () => {
              try {
                  // Get pdfjsLib from the window object
                  if (window['pdfjs-dist/build/pdf']) {
                      pdfjsLib = window['pdfjs-dist/build/pdf'];
                      pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('lib/pdf.worker.min.js');
                      resolve(pdfjsLib);
                  } else if (window.pdfjsLib) {
                      pdfjsLib = window.pdfjsLib;
                      pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('lib/pdf.worker.min.js');
                      resolve(pdfjsLib);
                  } else {
                      reject(new Error('PDF.js library not found in window object'));
                  }
              } catch (error) {
                  reject(new Error(`PDF.js initialization error: ${error.message}`));
              }
          };
          
          workerScript.onerror = () => reject(new Error('Failed to load PDF.js worker'));
          document.head.appendChild(workerScript);
      };
      
      script.onerror = () => reject(new Error('Failed to load PDF.js main script'));
      document.head.appendChild(script);
  });
}

// PDF content extraction
async function extractPdfContent() {
  try {
      // Load PDF.js
      const pdfLib = await loadPdfJs();
      if (!pdfLib) {
          throw new Error('PDF.js library not initialized');
      }

      // Get the PDF URL
      const pdfUrl = window.location.href;
      
      // Load the PDF document
      const loadingTask = pdfLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      
      let content = '';
      const numPages = pdf.numPages;

      // Process pages in chunks
      for (let i = 1; i <= numPages; i++) {
          try {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              
              content += textContent.items
                  .map(item => item.str)
                  .join(' ')
                  .replace(/\s+/g, ' ')
                  + '\n\n';
              
          } catch (pageError) {
              console.error(`Error extracting content from page ${i}:`, pageError);
              // Continue with next page even if one fails
          }
      }

      if (!content.trim()) {
          throw new Error('No text content could be extracted from PDF');
      }

      return content.trim();
  } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error(`Failed to extract PDF content: ${error.message}`);
  }
}

async function loadPdfAndGetDocument() {
    const pdfLib = await loadPdfJs();
    return await pdfLib.getDocument(window.location.href).promise;
}

async function processPdfChunk(pdf, startPage, endPage) {
    let chunkContent = '';
    for (let pageNum = startPage + 1; pageNum <= endPage; pageNum++) {
        try {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ')
                .replace(/\s+/g, ' ');
            chunkContent += pageText + '\n\n';
        } catch (error) {
            console.error(`Error processing PDF page ${pageNum}:`, error);
        }
    }
    return chunkContent;
}

// YouTube content extraction
function getYouTubeVideoId(url) {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com')) {
            return urlObj.searchParams.get('v') || null;
        }
        return null;
    } catch (error) {
        console.error('Error parsing URL:', error);
        return null;
    }
}

async function extractYouTubeContent() {
    const videoId = getYouTubeVideoId(window.location.href);
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
        const title = document.querySelector('h1.title.style-scope.ytd-video-primary-info-renderer');
        const description = document.querySelector('#description-text');
        const timestamp = document.querySelector('ytd-video-primary-info-renderer .ytd-video-primary-info-renderer');
        const channel = document.querySelector('#channel-name .ytd-channel-name');

        if (title && description) {
            return {
                content: formatYouTubeContent(title, description, timestamp, channel),
                videoId: videoId
            };
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        retries++;
    }

    throw new Error('Could not extract YouTube content after multiple attempts');
}

function formatYouTubeContent(title, description, timestamp, channel) {
    let content = '';
    content += `# ${title.textContent.trim()}\n\n`;
    
    if (channel) {
        content += `Channel: ${channel.textContent.trim()}\n`;
    }
    
    if (timestamp) {
        content += `Published: ${timestamp.textContent.trim()}\n`;
    }
    
    content += `\n## Description\n\n${description.textContent.trim()}`;
    return content;
}

function extractFeaturedImage() {
  // Try Open Graph image first
  let imageUrl = document.querySelector('meta[property="og:image"]')?.content;
  
  if (!imageUrl) {
      // Try Twitter image
      imageUrl = document.querySelector('meta[name="twitter:image"]')?.content;
  }
  
  if (!imageUrl) {
      // Try other common meta tags
      imageUrl = document.querySelector('meta[name="thumbnail"]')?.content ||
                document.querySelector('link[rel="image_src"]')?.href;
  }

  // Special handling for GitHub
  if (window.location.hostname === 'github.com' && !imageUrl) {
      // Try to get repository owner's avatar or organization image
      imageUrl = document.querySelector('.avatar-user')?.src ||
                document.querySelector('.avatar')?.src;
  }

  // Make sure we have an absolute URL
  if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = new URL(imageUrl, window.location.origin).href;
  }

  return imageUrl;
}

function extractWebContent() {
  const url = window.location.href;
  const videoId = getYouTubeVideoId(url);
  const featuredImage = extractFeaturedImage();
  
  if (window.location.hostname.includes('youtube.com')) {
      const title = document.querySelector('h1.title.style-scope.ytd-video-primary-info-renderer');
      const description = document.querySelector('#description-text');
      return {
          content: `Title: ${title ? title.textContent.trim() : 'N/A'}\n\nDescription: ${description ? description.textContent.trim() : 'N/A'}`,
          videoId: videoId,
          featuredImage: null  // For YouTube, we'll use the video thumbnail
      };
  } else {
      const article = document.querySelector('article');
      const main = document.querySelector('main');
      return {
          content: article ? article.innerText : (main ? main.innerText : document.body.innerText),
          videoId: null,
          featuredImage: featuredImage
      };
  }
}

// General web content extraction
function extractArticleContent() {
    // Try to find the main article content
    const selectors = [
        'article',
        '[role="article"]',
        'main',
        '.main-content',
        '#main-content',
        '.post-content',
        '.article-content',
        '.content-body'
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            return cleanAndFormatContent(element);
        }
    }

    // Fallback to body content
    return cleanAndFormatContent(document.body);
}

function cleanAndFormatContent(element) {
    // Remove unwanted elements
    const unwantedSelectors = [
        'script',
        'style',
        'nav',
        'header',
        'footer',
        'iframe',
        '.advertisement',
        '.social-share',
        '.comments',
        '.sidebar'
    ];

    const clone = element.cloneNode(true);
    unwantedSelectors.forEach(selector => {
        const elements = clone.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    });

    // Clean and format the text
    return clone.innerText
        .replace(/(\n\s*){3,}/g, '\n\n')  // Remove excessive newlines
        .replace(/\s+/g, ' ')             // Remove excessive whitespace
        .trim();
}

async function detectContentType() {
  try {
      const url = window.location.href;
      let contentToAnalyze = '';
      let title = '';

      // Extract content based on source type
      if (url.includes('youtube.com')) {
          title = document.querySelector('h1.title')?.textContent || '';
          const description = document.querySelector('#description-text')?.textContent || '';
          contentToAnalyze = `${title} ${description}`;
      } else if (document.contentType === 'application/pdf') {
          title = document.title || '';
          contentToAnalyze = document.body.innerText.slice(0, 2000);
      } else {
          title = document.title || '';
          const mainContent = document.querySelector('article, main, .content') || document.body;
          contentToAnalyze = mainContent.innerText.slice(0, 2000);
      }

      // Send content for categorization
      const message = {
          action: "categorize",
          data: {
              title: title,
              content: contentToAnalyze,
              url: url
          }
      };

      const response = await chrome.runtime.sendMessage(message);
      return response?.category || { type: 'Other', subtype: 'General' };
  } catch (error) {
      console.error('Error detecting content type:', error);
      return { type: 'Other', subtype: 'General' };
  }
}

// Main content extraction handler
async function extractContent() {
  try {
      let result;
      const contentType = await detectContentType();
      
      if (document.contentType === 'application/pdf') {
          const pdfContent = await extractPdfContent();
          result = {
              content: pdfContent,
              videoId: null,
              featuredImage: null,
              contentType: contentType
          };
      } else {
          const webContent = extractWebContent();
          result = {
              ...webContent,
              contentType: contentType
          };
      }

      if (!result.content) {
          throw new Error('No content could be extracted');
      }

      return result;
  } catch (error) {
      console.error('Error in extractContent:', error);
      throw error;
  }
}

// Message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getContent") {
    extractContent()
      .then(result => {
        if (result.content && result.content.length > 0) {
          sendResponse(result);
        } else {
          sendResponse({error: 'No content could be extracted'});
        }
      })
      .catch(error => {
        console.error('Error in message listener:', error);
        sendResponse({error: `Error extracting content: ${error.message}`});
      });
    return true; // Indicates we will respond asynchronously
  }
});

// Initialize PDF.js if needed
if (document.contentType === 'application/pdf') {
    loadPdfJs().catch(console.error);
}