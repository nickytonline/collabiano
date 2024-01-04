import { useEffect, useRef, useState } from "react";
import {
  BlackPianoKey,
  WhitePianoKey,
  type Note,
  type NoteMapKey,
} from "./PianoKeys";
import usePartySocket from "partysocket/react";
import type { CollabianoMessage } from "../../party";
import { KeyboardMap } from "./KeyboardMap";

type SoundThemeKey = keyof typeof themes | keyof typeof lockedThemes;
type AudioFileKey = `/assets/sounds/${SoundThemeKey}/${NoteMapKey<Note>}.mp3`;

const themes = {
  "default-theme": "default",
};

const lockedThemes = {
  "boop-theme": "boop",
};

const isProd = import.meta.env.PROD;
const host = isProd ? import.meta.env.PUBLIC_PARTYKIT_HOST : "localhost:1999";
const sounds = new Map<AudioFileKey, HTMLAudioElement>();

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
};

export const Piano = ({ username, roomId }: PianoProps) => {
  const availableThemes = themes;
  const endOfListRef = useRef<HTMLLIElement>(null);
  const [theme, setTheme] = useState<SoundThemeKey>("default-theme");
  const [messages, setMessages] = useState<CollabianoMessage[]>([]);
  const socket = usePartySocket({
    host,
    room: roomId,
    onMessage(event) {
      const message = JSON.parse(event.data) as CollabianoMessage;

      if (message.type === "powerup") {
        // @ts-expect-error - We know this is a valid key, just need to sort the types out.
        availableThemes[message.powerupId] = lockedThemes[message.powerupId];
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

  endOfListRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="grid place-content-center gap-4">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <fieldset className="relative">
          <legend className="sr-only">Piano</legend>
          <div className="flex gap-1 relative">
            <WhitePianoKey note="C4" playNote={playNote} />
            <WhitePianoKey note="D4" playNote={playNote} />
            <WhitePianoKey note="E4" playNote={playNote} />
            <WhitePianoKey note="F4" playNote={playNote} />
            <WhitePianoKey note="G4" playNote={playNote} />
            <WhitePianoKey note="A4" playNote={playNote} />
            <WhitePianoKey note="B4" playNote={playNote} />
            <WhitePianoKey note="C5" playNote={playNote} />
          </div>
          <div className="absolute top-4">
            <BlackPianoKey
              note="C#4"
              playNote={playNote}
              leftPosition="left-[25px] md:left-[29px]"
            />
            <BlackPianoKey
              note="D#4"
              playNote={playNote}
              leftPosition="left-[70px] md:left-[81px]"
            />
            <BlackPianoKey
              note="F#4"
              playNote={playNote}
              leftPosition="left-[157px] md:left-[185px]"
            />
            <BlackPianoKey
              note="G#4"
              playNote={playNote}
              leftPosition="left-[202px] md:left-[237px]"
            />
            <BlackPianoKey
              note="A#4"
              playNote={playNote}
              leftPosition="left-[246px] md:left-[290px]"
            />
          </div>
        </fieldset>
        <label className="flex gap-2 items-center">
          Theme
          <select
            className="w-max border p-1"
            onChange={(event) => {
              const theme = event.target.value as SoundThemeKey;
              setTheme(theme as SoundThemeKey);
              socket.send(
                JSON.stringify({
                  username,
                  // @ts-expect-error - We know this is a valid key, just need to sort the types out.
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
      <h2>Notes played</h2>
      <ul className="overflow-y-scroll h-48">
        {messages.map(({ username, message, type }, index) => (
          <li
            key={index}
            className={`p-2 rounded flex gap-2 w-max ${
              type === "powerup" ? "bg-black text-yellow-300" : ""
            }`}
          >
            <span>{username}:</span>
            <span>{message}</span>
            {type === "note" ? <span>🎵</span> : null}
          </li>
        ))}
        <li ref={endOfListRef} />
      </ul>
    </div>
  );
};
