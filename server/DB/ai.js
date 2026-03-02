import OpenAI from "openai"

let aiClient;

if (!process.env.OPENAI_API_KEY) {
  console.warn("OpenAI API key not found — using mock AI for local testing.");

  const mockAI = {
    chat: {
      completions: {
        create: async ({ messages }) => {
          const userMessage = messages && messages.length ? messages[messages.length - 1].content : '';
          const content = `MOCK: Enhanced summary based on input -> ${userMessage}`;
          return { choices: [{ message: { content } }] };
        },
      },
    },
  };

  aiClient = mockAI;
} else {
  aiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });
}

export default aiClient;