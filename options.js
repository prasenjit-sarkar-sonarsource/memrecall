document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const autosaveCheckbox = document.getElementById('autosave');
  const translateSelect = document.getElementById('translateLang');
  const conciseBtn = document.getElementById('conciseBtn');
  const detailedBtn = document.getElementById('detailedBtn');
  const saveButton = document.getElementById('saveSettings');
  const themeToggle = document.getElementById('themeToggle');

  // Load saved settings
  chrome.storage.sync.get({
      autosave: false,
      translateLanguage: 'none',
      summaryLength: 'detailed',
      theme: 'dark'
  }, function(items) {
      // Apply saved settings
      autosaveCheckbox.checked = items.autosave;
      translateSelect.value = items.translateLanguage;
      
      if (items.summaryLength === 'concise') {
          conciseBtn.classList.add('active');
          detailedBtn.classList.remove('active');
      } else {
          detailedBtn.classList.add('active');
          conciseBtn.classList.remove('active');
      }

      // Apply saved theme
      applyTheme(items.theme);
  });

  // Theme toggle
  themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(currentTheme);
      
      // Save theme preference
      chrome.storage.sync.set({ theme: currentTheme });
  });

  function applyTheme(theme) {
      // Set theme attribute on root element
      document.documentElement.setAttribute('data-theme', theme);
      
      // Update theme toggle icon
      themeToggle.innerHTML = theme === 'light' 
          ? '<span class="material-icons">dark_mode</span>' 
          : '<span class="material-icons">light_mode</span>';
  }

  // Length toggle buttons
  conciseBtn.addEventListener('click', function() {
      conciseBtn.classList.add('active');
      detailedBtn.classList.remove('active');
  });

  detailedBtn.addEventListener('click', function() {
      detailedBtn.classList.add('active');
      conciseBtn.classList.remove('active');
  });

  // Save settings
  saveButton.addEventListener('click', function() {
      const settings = {
          autosave: autosaveCheckbox.checked,
          translateLanguage: translateSelect.value,
          summaryLength: conciseBtn.classList.contains('active') ? 'concise' : 'detailed',
          theme: document.documentElement.getAttribute('data-theme')
      };

      chrome.storage.sync.set(settings, function() {
          // Show save confirmation
          saveButton.textContent = 'Saved!';
          setTimeout(() => {
              saveButton.textContent = 'Save';
          }, 2000);

          // Broadcast settings update
          chrome.runtime.sendMessage({
              action: 'settingsUpdated',
              settings: settings
          });
      });
  });
});