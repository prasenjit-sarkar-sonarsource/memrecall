import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const languageOptions = [
  { code: 'none', label: "Don't Translate", flag: '🌐' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'it', label: 'Italian', flag: '🇮🇹' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', label: 'Korean', flag: '🇰🇷' },
  { code: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', label: 'Russian', flag: '🇷🇺' }
];

const LanguageSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLanguage = languageOptions.find(lang => lang.code === value) || languageOptions[0];

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">{selectedLanguage.flag}</span>
          <span>{selectedLanguage.label}</span>
        </span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute w-full mt-2 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          {languageOptions.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                onChange(language.code);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl">{language.flag}</span>
              <span>{language.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;