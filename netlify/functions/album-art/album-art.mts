import OpenAI from "openai";
import type { Animal, MusicGenre } from "../../../src/components/Piano";
import type { Note } from "../../../src/components/PianoKeys";

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY!;

// @ts-expect-error TODO: add types for event
export const handler = async function (event /* context */) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { notes, musicGenre, animal } = JSON.parse(event.body) as {
    notes: Note[];
    musicGenre: MusicGenre;
    animal: Animal;
  };

  let extraDetails = "";

  switch (musicGenre) {
    case "Pop":
      extraDetails =
        "Pop album covers often feature bright colors and glamorous imagery.";
      break;
    case "Rock":
      extraDetails =
        "Rock album covers can be edgy and may include band photos or iconic symbols.";
      break;
    case "Hip-Hop":
      extraDetails =
        "Hip-Hop album covers often showcase urban landscapes, graffiti art, or artist portraits.";
      break;
    case "Jazz":
      extraDetails =
        "Jazz album covers may have a vintage feel with elegant typography and artistic illustrations.";
      break;
    case "Classical":
      extraDetails =
        "Classical album covers tend to be classical art pieces or minimalist designs.";
      break;
    case "Country":
      extraDetails =
        "Country album covers often depict rural scenes, cowboys, or Western themes.";
      break;
    case "Electronic":
      extraDetails =
        "Electronic album covers can be futuristic with abstract graphics and neon colors.";
      break;
    case "R&B":
      extraDetails =
        "R&B album covers may feature sensual or romantic imagery with smooth typography.";
      break;
    case "Reggae":
      extraDetails =
        "Reggae album covers often include Rastafarian symbolism, cannabis references, or Jamaican culture.";
      break;
    case "Blues":
      extraDetails =
        "Blues album covers may have a vintage and moody aesthetic with blues musicians or instruments.";
      break;
    case "Metal":
      extraDetails =
        "Metal album covers are known for their dark and intense visuals, often featuring fantasy or gothic elements.";
      break;
    case "Folk":
      extraDetails =
        "Folk album covers usually have a rustic or natural look, featuring folk musicians and acoustic instruments.";
      break;
    case "Indie":
      extraDetails =
        "Indie album covers can be quirky and artistic, often reflecting the independent spirit of the genre.";
      break;
    case "Punk":
      extraDetails =
        "Punk album covers are typically raw and rebellious, with DIY aesthetics and punk symbols.";
      break;
    // Add more cases for other genres as needed
    default:
      extraDetails =
        "Sorry, album cover details for this genre are not available.";
  }

  console.log(extraDetails);

  const prompt = `Create a ${musicGenre} music genre album cover based on this array of strings, ${JSON.stringify(
    notes
  )}. The image has a ${animal} in it. ${extraDetails}. The image should be inverted.`;

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
