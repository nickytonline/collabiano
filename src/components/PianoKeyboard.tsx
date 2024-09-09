import React, { useEffect } from "react";
import { BlackPianoKey, WhitePianoKey, type Note } from "./PianoKeys";

interface PianoKeyboardProps {
  playNote: (note: Note) => void;
}

const keyNoteMap: { [key: string]: Note } = {
  a: "C4",
  s: "D4",
  d: "E4",
  f: "F4",
  g: "G4",
  h: "A4",
  j: "B4",
  k: "C5",
  w: "C#4",
  e: "D#4",
  t: "F#4",
  y: "G#4",
  u: "A#4",
};

export const PianoKeyboard = ({ playNote }: PianoKeyboardProps) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const note = keyNoteMap[event.key.toLowerCase()];
    if (note) {
      playNote(note);
      highlightKey(note);
    }
  };

  const highlightKey = (note: Note) => {
    const keyElement = document.querySelector(`[data-note="${note}"]`);
    if (keyElement) {
      const isBlackKey = note.includes("#");
      const highlightColor = isBlackKey ? "#A8A9AD" : "#D1D4DC";
      keyElement.setAttribute("style", `background-color: ${highlightColor};`);
      setTimeout(() => {
        keyElement.removeAttribute("style");
      }, 200);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="flex gap-1 relative">
        <WhitePianoKey
          note="C4"
          playNote={playNote}
          highlightKey={highlightKey}
        />
        <WhitePianoKey
          note="D4"
          playNote={playNote}
          highlightKey={highlightKey}
        />
        <WhitePianoKey
          note="E4"
          playNote={playNote}
          highlightKey={highlightKey}
        />
        <WhitePianoKey
          note="F4"
          playNote={playNote}
          highlightKey={highlightKey}
        />
        <WhitePianoKey
          note="G4"
          playNote={playNote}
          highlightKey={highlightKey}
        />
        <WhitePianoKey
          note="A4"
          playNote={playNote}
          highlightKey={highlightKey}
        />
        <WhitePianoKey
          note="B4"
          playNote={playNote}
          highlightKey={highlightKey}
        />
        <WhitePianoKey
          note="C5"
          playNote={playNote}
          highlightKey={highlightKey}
        />
      </div>
      <div className="absolute top-4">
        <BlackPianoKey
          note="C#4"
          playNote={playNote}
          leftPosition="left-[25px] md:left-[29px]"
          highlightKey={highlightKey}
        />
        <BlackPianoKey
          note="D#4"
          playNote={playNote}
          leftPosition="left-[70px] md:left-[81px]"
          highlightKey={highlightKey}
        />
        <BlackPianoKey
          note="F#4"
          playNote={playNote}
          leftPosition="left-[157px] md:left-[185px]"
          highlightKey={highlightKey}
        />
        <BlackPianoKey
          note="G#4"
          playNote={playNote}
          leftPosition="left-[202px] md:left-[237px]"
          highlightKey={highlightKey}
        />
        <BlackPianoKey
          note="A#4"
          playNote={playNote}
          leftPosition="left-[246px] md:left-[290px]"
          highlightKey={highlightKey}
        />
      </div>
    </>
  );
};
