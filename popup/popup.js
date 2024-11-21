import React from 'react';
import ReactDOM from 'react-dom';
import KeywordPills from '../components/KeywordPills';
import { marked } from 'marked';

document.addEventListener('DOMContentLoaded', function() {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const copyBtn = document.getElementById('copyBtn');
  const exportBtn = document.getElementById('exportBtn');
  const summaryElement = document.getElementById('summary');
  const errorElement = document.getElementById('error');
  const conciseTab = document.getElementById('conciseTab');
  const detailedTab = document.getElementById('detailedTab');
  const settingsBtn = document.getElementById('settingsBtn');
  const closeBtn = document.getElementById('closeBtn');

  let currentSummary = '';
  let summaryMode = 'concise';
  let currentVideoId = null;
  let currentFeaturedImage = null;
  let currentContentType = null;

  function displaySummary(result) {
    let content = '';
    
    
    if (currentContentType?.type && currentContentType?.subtype) {
      content += `
        <div class="topic-tags mb-4">
          <span class="topic-tag">${currentContentType.type}</span>
          ${currentContentType.type !== currentContentType.subtype ? `
            <span class="topic-tag-separator">|</span>
            <span class="topic-tag">${currentContentType.subtype}</span>
          ` : ''}
        </div>`;
    }

    
    if (currentVideoId) {
      content += `<img src="https://img.youtube.com/vi/${currentVideoId}/0.jpg" 
                  alt="Video Thumbnail" 
                  class="w-full mb-4 rounded-lg">`;
    } else if (currentFeaturedImage) {
      content += `<img src="${currentFeaturedImage}" 
                  alt="Featured Image" 
                  class="w-full mb-4 rounded-lg">`;
    }

    
    const summaryText = typeof result === 'string' ? result : result.summary;
    if (summaryText) {
      content += `<div class="text-gray-200 mb-6">${marked.parse(summaryText)}</div>`;
    }

    
    if (result.keywords && Array.isArray(result.keywords) && result.keywords.length > 0) {
      
      const keywordsContainerId = 'keywordsContainer';
      content += `<div id="${keywordsContainerId}"></div>`;
      
      
      summaryElement.innerHTML = content;
      
      
      const keywordsContainer = document.getElementById(keywordsContainerId);
      if (keywordsContainer) {
        ReactDOM.render(
          <KeywordPills keywords={result.keywords} />,
          keywordsContainer
        );
      }
    } else {
      
      summaryElement.innerHTML = content;
    }

    
    copyBtn.style.display = 'block';
    exportBtn.style.display = 'block';
  }

  function openSettings() {
    chrome.runtime.openOptionsPage();
  }

  function closePopup() {
    window.close();
  }

  async function checkForExistingSummary() {
    try {
      const tabs = await chrome.tabs.query({active: true, currentWindow: true});
      const url = tabs[0].url;
      const result = await chrome.storage.local.get(url);
      if (result[url]) {
        currentSummary = result[url].summary;
        currentVideoId = result[url].videoId;
        currentFeaturedImage = result[url].featuredImage;
        currentContentType = result[url].contentType;
        displaySummary(result[url]);
      }
    } catch (error) {
      console.error('Error checking for existing summary:', error);
    }
  }

  function getFullMarkdown() {
    let markdown = '';
    
    if (currentVideoId) {
      markdown += `![Video Thumbnail](https://img.youtube.com/vi/${currentVideoId}/0.jpg)\n\n`;
    } else if (currentFeaturedImage) {
      markdown += `![Featured Image](${currentFeaturedImage})\n\n`;
    }
    
    markdown += currentSummary;
    return markdown;
  }

  function copyToClipboard() {
    if (currentSummary) {
      navigator.clipboard.writeText(getFullMarkdown()).then(() => {
        
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="material-icons">check</span>';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      }, () => {
        alert('Failed to copy summary.');
      });
    }
  }

  function exportMarkdown() {
    if (currentSummary) {
      const blob = new Blob([getFullMarkdown()], {type: 'text/markdown'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'summary.md';
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  async function summarizeContent() {
    try {
      summaryElement.innerHTML = '<div class="loading">Summarizing...</div>';
      errorElement.textContent = '';
      copyBtn.style.display = 'none';
      exportBtn.style.display = 'none';

      const response = await chrome.runtime.sendMessage({
        action: "summarize",
        mode: summaryMode
      });

      if (response.error) {
        handleError(response.error);
        return;
      }

      if (response && typeof response === 'object') {
        currentSummary = response.summary || '';
        currentVideoId = response.videoId;
        currentFeaturedImage = response.featuredImage;
        currentContentType = response.contentType;
        displaySummary(response);
      }
    } catch (error) {
      handleError(error.message);
    }
  }

  function switchTab(mode) {
    summaryMode = mode;
    if (mode === 'concise') {
      conciseTab.classList.add('active');
      detailedTab.classList.remove('active');
    } else {
      detailedTab.classList.add('active');
      conciseTab.classList.remove('active');
    }

    chrome.storage.sync.set({ summaryLength: mode });

    if (currentSummary) {
      summarizeContent();
    }
  }

  function handleError(message) {
    errorElement.textContent = message;
    summaryElement.innerHTML = '';
    copyBtn.style.display = 'none';
    exportBtn.style.display = 'none';
  }

  
  settingsBtn?.addEventListener('click', openSettings);
  closeBtn?.addEventListener('click', closePopup);
  summarizeBtn?.addEventListener('click', summarizeContent);
  copyBtn?.addEventListener('click', copyToClipboard);
  exportBtn?.addEventListener('click', exportMarkdown);
  conciseTab?.addEventListener('click', () => switchTab('concise'));
  detailedTab?.addEventListener('click', () => switchTab('detailed'));

  
  chrome.storage.sync.get({
    summaryLength: 'detailed',
    autosave: false,
    translateLanguage: 'none'
  }, function(settings) {
    if (settings.summaryLength === 'concise') {
      conciseTab?.classList.add('active');
      detailedTab?.classList.remove('active');
    } else {
      detailedTab?.classList.add('active');
      conciseTab?.classList.remove('active');
    }
    summaryMode = settings.summaryLength;
  });

  
  checkForExistingSummary();
});
