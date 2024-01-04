import { BlackPianoKey, WhitePianoKey, type Note } from "./PianoKeys";

interface PianoKeyboardProps {
  playNote: (note: Note) => void;
}

export const PianoKeyboard = ({ playNote }: PianoKeyboardProps) => {
  return (
    <>
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
    </>
  );
};
