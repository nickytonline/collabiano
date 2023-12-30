import { useEffect, useState } from "react";
import { BlackPianoKey, WhitePianoKey, type Note } from "./PianoKeys";
import usePartySocket from "partysocket/react";
import type { NoteMessage } from "../../party";

const host = import.meta.env.PUBLIC_PARTYKIT_HOST ?? "localhost:1999";

interface PianoProps {
  username: string;
  roomId: string;
}

export const Piano = ({ username, roomId }: PianoProps) => {
  const [messages, setMessages] = useState<NoteMessage[]>([]);
  const socket = usePartySocket({
    host,
    room: roomId,
    onMessage(event) {
      const message = JSON.parse(event.data) as NoteMessage;

      if (message.note) {
        setMessages((messages) => [...messages, message]);
      }
    },
  });

  useEffect(() => {
    return () => {
      socket.close();
    };
  }, [socket]);

  function playNote(note: Note) {
    socket.send(JSON.stringify({ username, note }));
  }

  return (
    <div className="grid place-content-center">
      <form onSubmit={(event) => event.preventDefault()}>
        <fieldset className="piano">
          <legend className="sr-only">Piano</legend>
          <div className="flex gap-1">
            <WhitePianoKey note="C4" playNote={playNote} />
            <WhitePianoKey note="D4" playNote={playNote} />
            <WhitePianoKey note="E4" playNote={playNote} />
            <WhitePianoKey note="F4" playNote={playNote} />
            <WhitePianoKey note="G4" playNote={playNote} />
            <WhitePianoKey note="A4" playNote={playNote} />
            <WhitePianoKey note="B4" playNote={playNote} />
            <WhitePianoKey note="C5" playNote={playNote} />
          </div>
          <div>
            <BlackPianoKey note="C#4" playNote={playNote} />
            <BlackPianoKey note="D#4" playNote={playNote} />
            <BlackPianoKey note="F#4" playNote={playNote} />
            <BlackPianoKey note="G#4" playNote={playNote} />
            <BlackPianoKey note="A#4" playNote={playNote} />
          </div>
        </fieldset>
      </form>
      <h2>Notes played</h2>
      <ul className="overflow-y-auto h-48 w-48">
        {messages.map((message, index) => (
          <li key={index} className="flex gap-2">
            <span>{message.username}</span>
            <span>{message.note}</span>
            <span>🎵</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
