import OpenAI from "openai";

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY!;

// @ts-expect-error TODO: add types for event
export const handler = async function (event /* context */) {
  if (event.httpMethod !== "POST") {
    // return { statusCode: 405, body: "Method Not Allowed" };
  }

  const userPrompt = ["C5", "D#4", "E2"];

  const prompt = `Create an abstract vibrant image base on this array of strings, ${JSON.stringify(
    userPrompt
  )}. Include a corgi, a hairless cat or a gopher. No text or logos in the image.`;

  try {
    const response = await openai.images.generate({
      prompt,
      n: 1,
    });

    const [imageData] = response.data;

    return {
      statusCode: 200,
      body: JSON.stringify(imageData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error generating image" }),
    };
  }
};
