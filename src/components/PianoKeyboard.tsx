import { BlackPianoKey, WhitePianoKey, type Note } from "./PianoKeys";

interface PianoKeyboardProps {
  playNote: (note: Note) => void;
}

export const PianoKeyboard = ({ playNote }: PianoKeyboardProps) => {
  const pressPianoKey = (event: React.KeyboardEvent | React.MouseEvent) => {
    const { note } = (event.target as HTMLElement).dataset;

    if (!note) {
      throw new Error("No note found on key");
    }

    playNote(note as Note);
  };

  return (
    // Disable eslint rule for static element interactions here because the div is just handling
    // event delegation for the piano keys. The piano keys themselves are buttons.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div onClick={pressPianoKey}>
      <div className="flex gap-1 relative">
        <WhitePianoKey note="C4" />
        <WhitePianoKey note="D4" />
        <WhitePianoKey note="E4" />
        <WhitePianoKey note="F4" />
        <WhitePianoKey note="G4" />
        <WhitePianoKey note="A4" />
        <WhitePianoKey note="B4" />
        <WhitePianoKey note="C5" />
      </div>
      <div className="absolute top-4">
        <BlackPianoKey note="C#4" leftPosition="left-[25px] md:left-[29px]" />
        <BlackPianoKey note="D#4" leftPosition="left-[70px] md:left-[81px]" />
        <BlackPianoKey note="F#4" leftPosition="left-[157px] md:left-[185px]" />
        <BlackPianoKey note="G#4" leftPosition="left-[202px] md:left-[237px]" />
        <BlackPianoKey note="A#4" leftPosition="left-[246px] md:left-[290px]" />
      </div>
    </div>
  );
};
