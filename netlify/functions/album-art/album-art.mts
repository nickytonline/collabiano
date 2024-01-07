import OpenAI from "openai";

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY!;

// @ts-expect-error TODO: add types for event
export const handler = async function (event /* context */) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const userPrompt = event.body;

  const prompt = `Create an abstract vibrant based on this array of strings, ${userPrompt}. Include a corgi, a hairless cat or a gopher. No text or logos in the image. The image should have text no more than three words. Image dimensions must be 500 pixels wide and 500 pixels high`;

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
