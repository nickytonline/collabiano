import OpenAI from "openai";
import type { Animal, MusicGenre } from "../../../src/components/Piano";
import type { Note } from "../../../src/components/PianoKeys";
import { type Handler } from "@netlify/functions";

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY!;

function getExtraPromptDetails(musicGenre: MusicGenre) {
  switch (musicGenre) {
    case "Pop":
      return "Pop album covers often feature bright colors and glamorous imagery.";
    case "Rock":
      return "Rock album covers can be edgy and may include band photos or iconic symbols.";
    case "Hip-Hop":
      return "Hip-Hop album covers often showcase urban landscapes, graffiti art, or artist portraits.";
    case "Jazz":
      return "Jazz album covers may have a vintage feel with elegant typography and artistic illustrations.";
    case "Classical":
      return "Classical album covers tend to be classical art pieces or minimalist designs.";
    case "Country":
      return "Country album covers often depict rural scenes, cowboys, or Western themes.";
    case "Electronic":
      return "Electronic album covers can be futuristic with abstract graphics and neon colors.";
    case "R&B":
      return "R&B album covers may feature sensual or romantic imagery with smooth typography.";
    case "Reggae":
      return "Reggae album covers often include Rastafarian symbolism, cannabis references, or Jamaican culture.";
    case "Blues":
      return "Blues album covers may have a vintage and moody aesthetic with blues musicians or instruments.";
    case "Metal":
      return "Metal album covers are known for their dark and intense visuals, often featuring fantasy or gothic elements.";
    case "Folk":
      return "Folk album covers usually have a rustic or natural look, featuring folk musicians and acoustic instruments.";
    case "Indie":
      return "Indie album covers can be quirky and artistic, often reflecting the independent spirit of the genre.";
    case "Punk":
      return "Punk album covers are typically raw and rebellious, with DIY aesthetics and punk symbols.";
    // Add more cases for other genres as needed
    default:
      return "Sorry, album cover details for this genre are not available.";
  }
}

export const handler: Handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { notes, musicGenre, animal } = JSON.parse(event.body ?? "") as {
    notes: Note[];
    musicGenre: MusicGenre;
    animal: Animal;
  };

  const extraDetails = getExtraPromptDetails(musicGenre);

  console.log(extraDetails);

  const prompt = `Create a ${musicGenre} music genre album cover based on this array of strings, ${JSON.stringify(
    notes
  )}. The image must have an ${animal} in it. ${extraDetails}.`;

  console.log("prompt", prompt);

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
