export const config = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    API_URL: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-4-turbo-preview',
    MAX_INPUT_TOKENS: 8000,
    MAX_OUTPUT_TOKENS: 4000,
    MAX_TOTAL_OUTPUT: 16000
};