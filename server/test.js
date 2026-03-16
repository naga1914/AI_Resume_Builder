import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "AIzaSyC6hpUyIBlZ6BX0VqH-MWaCNUShTBaJDTY", // paste your key here
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
});

async function test() {
  try {
    const res = await client.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: "user", content: "Say hello" }
      ],
    });

    console.log(res.choices[0].message.content);
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}

test();