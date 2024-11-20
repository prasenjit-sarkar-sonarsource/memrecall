import { config } from './config';

const API_KEY = config.OPENAI_API_KEY;
const API_URL = config.API_URL;

async function summarizeContent(content) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: config.MODEL,
      messages: [
        {role: 'system', content: 'You are a helpful assistant that summarizes content.'},
        {role: 'user', content: `Summarize the following content: ${content}`}
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

export { summarizeContent };