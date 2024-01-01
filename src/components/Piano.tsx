import { useEffect, useState } from "react";
import {
  BlackPianoKey,
  WhitePianoKey,
  type Note,
  type NoteMapKey,
} from "./PianoKeys";
import usePartySocket from "partysocket/react";
import type { CollabianoMessage } from "../../party";

type SoundTheme = "default-theme";
type AudioFileKey = `/assets/sounds/${SoundTheme}/${NoteMapKey<Note>}.mp3`;

const isProd = import.meta.env.PROD;
const host = isProd ? import.meta.env.PUBLIC_PARTYKIT_HOST : "localhost:1999";
const sounds = new Map<AudioFileKey, HTMLAudioElement>();

function playSound(note: Note, theme: SoundTheme) {
  const key = note.replace("#", "_sharp_").toLowerCase() as NoteMapKey<Note>;
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

export const Piano = ({ username, roomId }: PianoProps) => {
  const [theme] = useState<SoundTheme>("default-theme");
  const [messages, setMessages] = useState<CollabianoMessage[]>([]);
  const socket = usePartySocket({
    host,
    room: roomId,
    onMessage(event) {
      const message = JSON.parse(event.data) as CollabianoMessage;

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

  return (
    <div className="grid place-content-center">
      <form onSubmit={(event) => event.preventDefault()}>
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
              leftPosition="left-[157px] md:left-[134px]"
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
      </form>
      <h2>Notes played</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index} className="flex gap-2">
            <span>{message.username}</span>
            <span>{message.message}</span>
            <span>🎵</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
