import { useEffect, useState } from "react";
import { type Note, type NoteMapKey } from "./PianoKeys";
import usePartySocket from "partysocket/react";
import type { CollabianoMessage, PowerUpMessage } from "../../party";
import { KeyboardMap } from "./KeyboardMap";
import { Messages } from "./Messages";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PianoKeyboard } from "./PianoKeyboard";
import { AlbumArt } from "./AlbumArt";

type SoundThemeKey = keyof typeof themes | keyof typeof lockedThemes;
type AudioFileKey = `/assets/sounds/${SoundThemeKey}/${NoteMapKey<Note>}.mp3`;

// an array of 30 animals with the first in the list being a corgi
const animals = [
  "Corgi",
  "Llama",
  "Alpaca",
  "Unicorn",
  "Dragon",
  "Dinosaur",
  "Pegasus",
  "Platypus",
  "Cat",
  "Lion",
  "Tiger",
  "Bear",
  "Elephant",
  "Koala",
  "Gorilla",
  "Camel",
  "Leopard",
  "Polar Bear",
  "Kangaroo",
  "Giraffe",
  "Penguin",
  "Panda",
  "Duck",
  "Pig",
  "Cow",
  "Horse",
  "Zebra",
  "Rabbit",
  "Frog",
  "Chicken",
  "Monkey",
  "Owl",
  "Goat",
  "Sheep",
  "Deer",
  "Wolf",
  "Fox",
  "Mouse",
  "Rat",
  "Snake",
  "Turtle",
  "Fish",
] as const;

export type Animal = (typeof animals)[number];

const musicGenres = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "Jazz",
  "Classical",
  "Country",
  "Electronic",
  "R&B",
  "Reggae",
  "Blues",
  "Metal",
  "Folk",
  "Indie",
  "Punk",
] as const;

export type MusicGenre = (typeof musicGenres)[number];

type Theme = "boop-theme" | "default-theme";

const themes = {
  "default-theme": "default",
};

const lockedThemes = {
  "boop-theme": "boop",
};

const isProd = import.meta.env.PROD;
const host = isProd ? import.meta.env.PUBLIC_PARTYKIT_HOST : "localhost:1999";
const sounds = new Map<AudioFileKey, HTMLAudioElement>();

async function generateAlbumArt({
  notes,
  musicGenre,
  animal,
  maxRetries = 3,
}: {
  notes: Note[];
  musicGenre: MusicGenre;
  animal: Animal;
  maxRetries?: number;
}) {
  let retryCount = 0;
  while (retryCount < maxRetries) {
    try {
      const response = await fetch("/.netlify/functions/album-art", {
        method: "POST",
        body: JSON.stringify({ notes, musicGenre, animal }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate album art");
      }

      const { url } = await response.json();

      return url;
    } catch (error) {
      retryCount++;
      if (retryCount === maxRetries) {
        throw error; // Throw the error if retries are exhausted
      }
      // You can optionally add a delay between retries here if needed
      // For example: await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

function playSound(note: Note, theme: SoundThemeKey) {
  const key = note.replace("#", "-sharp-").toLowerCase() as NoteMapKey<Note>;
  const soundFile = `/assets/sounds/${theme}/${key}.mp3` satisfies AudioFileKey;

  if (!sounds.has(soundFile)) {
    const audio = new Audio(soundFile);
    sounds.set(soundFile, audio);
  }

  const audio = sounds.get(soundFile)!;
  audio.currentTime = 0;
  audio.play();
}

interface PianoProps {
  username: string;
  roomId: string;
}

const keyboardMap: Record<string, Note> = {
  a: "C4",
  w: "C#4",
  s: "D4",
  e: "D#4",
  d: "E4",
  f: "F4",
  t: "F#4",
  g: "G4",
  y: "G#4",
  h: "A4",
  u: "A#4",
  j: "B4",
  k: "C5",
} as const;

export const Piano = ({ username, roomId }: PianoProps) => {
  const [boopUnlocked, setBoopUnlocked] = useState(false);
  const availableThemes: Partial<Record<Theme, string>> = themes;
  const [theme, setTheme] = useState<SoundThemeKey>("default-theme");
  const [albumArtEnabled, setAlbumArtEnabled] = useState(false);
  const [messages, setMessages] = useState<CollabianoMessage[]>([]);
  const socket = usePartySocket({
    host,
    room: roomId,
    onMessage(event) {
      const message = JSON.parse(event.data) as CollabianoMessage;

      if (message.type === "powerup") {
        if (message.powerupId === "boop-theme") {
          availableThemes[message.powerupId] = lockedThemes[message.powerupId];
        }

        toast(message.message);
      }

      if (message.type === "note") {
        playSound(message.message, theme);
      }

      setMessages((messages) => [...messages, message]);
    },
  });

  useEffect(() => {
    return () => {
      socket.close();
    };
  }, [socket]);

  function playNote(note: Note) {
    socket.send(JSON.stringify({ username, message: note, type: "note" }));
  }

  if (!boopUnlocked && messages.length > 30) {
    setBoopUnlocked(true);
    socket.send(
      JSON.stringify({
        username: "server",
        powerupId: "boop-theme",
        message: "Boop theme unlocked!",
        type: "powerup",
      } satisfies PowerUpMessage)
    );
  }

  if (!albumArtEnabled && messages.length > 60) {
    setAlbumArtEnabled(true);

    socket.send(
      JSON.stringify({
        username: "server",
        powerupId: "album-art",
        message: "Album art feature unlocked!",
        type: "powerup",
      } satisfies PowerUpMessage)
    );
  }

  const lastTenNotes = messages
    .filter((message) => message.type === "note")
    .slice(-10)
    .map((message) => message.message) as Note[];

  return (
    <>
      <div className="grid place-content-center gap-4">
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <fieldset className="relative self-center">
            <legend className="sr-only">Piano</legend>
            <PianoKeyboard playNote={playNote} />
          </fieldset>
          <label className="flex gap-2 items-center">
            Theme
            <select
              className="w-max border p-1"
              onChange={(event) => {
                const theme = event.target.value as SoundThemeKey;
                setTheme(theme as SoundThemeKey);
                // clear cache so new theme can fill it
                // this can be improved to keep all themes in memory
                sounds.clear();
                socket.send(
                  JSON.stringify({
                    username,
                    message: `I changed my theme to the ${availableThemes[theme]} theme`,
                    type: "message",
                  })
                );
              }}
            >
              {Object.entries(availableThemes).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </form>
        <KeyboardMap
          keyMap={keyboardMap}
          onKeyPress={(event: KeyboardEvent) => {
            const note = keyboardMap[event.key];

            if (note) {
              playNote(note);
            }
          }}
        />
        {albumArtEnabled ? (
          <AlbumArt
            generateAlbumArt={generateAlbumArt}
            musicGenres={musicGenres}
            notes={lastTenNotes}
            animals={animals}
          />
        ) : null}
        <Messages messages={messages} />
      </div>
      <ToastContainer />
    </>
  );
};
