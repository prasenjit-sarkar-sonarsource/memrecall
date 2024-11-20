import React from 'react';

const KeywordPill = ({ keyword }) => {
  const getIconForKeyword = (keyword) => {
    // Technology & Programming
    if (keyword.match(/\b(api|code|programming|software|web|app|database|cloud)\b/i)) return '💻';
    if (keyword.match(/\b(ai|ml|machine learning|artificial intelligence|chatgpt|bot)\b/i)) return '🤖';
    if (keyword.match(/\b(automation|workflow|process)\b/i)) return '⚙️';
    if (keyword.match(/\b(data|analytics|metrics|statistics)\b/i)) return '📊';
    
    // Business & Marketing
    if (keyword.match(/\b(marketing|sales|business|strategy|growth)\b/i)) return '📈';
    if (keyword.match(/\b(social media|facebook|twitter|instagram|linkedin)\b/i)) return '📱';
    if (keyword.match(/\b(content|blog|article|post|writing)\b/i)) return '✍️';
    
    // Design & Creative
    if (keyword.match(/\b(design|ui|ux|interface|graphic|art)\b/i)) return '🎨';
    if (keyword.match(/\b(video|audio|media|music|sound)\b/i)) return '🎥';
    if (keyword.match(/\b(creative|innovation|idea|concept)\b/i)) return '💡';
    
    // Education & Learning
    if (keyword.match(/\b(learn|study|education|course|training|tutorial)\b/i)) return '📚';
    if (keyword.match(/\b(research|science|academic|paper|study)\b/i)) return '🔬';
    if (keyword.match(/\b(question|answer|faq|help|support)\b/i)) return '❓';
    
    // Time & Productivity
    if (keyword.match(/\b(time|schedule|calendar|productivity|efficiency)\b/i)) return '⏰';
    if (keyword.match(/\b(task|todo|project|management|planning)\b/i)) return '📋';
    
    // Communication & Networking
    if (keyword.match(/\b(communication|chat|message|email|contact)\b/i)) return '💬';
    if (keyword.match(/\b(team|collaboration|group|community|network)\b/i)) return '👥';
    
    // Finance & Business
    if (keyword.match(/\b(money|finance|payment|price|cost|budget)\b/i)) return '💰';
    if (keyword.match(/\b(analysis|report|review|assessment|evaluation)\b/i)) return '📝';
    
    // Generic Categories
    if (keyword.match(/\b(health|wellness|fitness|medical)\b/i)) return '🏥';
    if (keyword.match(/\b(food|recipe|cooking|nutrition)\b/i)) return '🍳';
    if (keyword.match(/\b(travel|location|place|destination)\b/i)) return '✈️';
    if (keyword.match(/\b(security|privacy|protection|safety)\b/i)) return '🔒';
    
    return '🏷️'; // Default tag icon
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full transition-all hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg">
      <span className="flex items-center justify-center w-6 h-6 bg-gray-700 rounded-full">
        {getIconForKeyword(keyword)}
      </span>
      <span className="text-sm text-gray-200">
        {keyword}
      </span>
    </div>
  );
};

// Container component for keyword pills
const KeywordContainer = ({ keywords }) => {
  if (!keywords?.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-6 p-4 bg-gray-900/50 rounded-xl animate-fadeIn">
      {keywords.map((keyword, index) => (
        <KeywordPill key={`${keyword}-${index}`} keyword={keyword} />
      ))}
    </div>
  );
};

export default KeywordContainer;