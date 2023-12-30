export type Note =
  | "C4"
  | "D4"
  | "E4"
  | "F4"
  | "G4"
  | "A4"
  | "B4"
  | "C5"
  | "C#4"
  | "D#4"
  | "F#4"
  | "G#4"
  | "A#4";

interface PianoKeyProps {
  note: string;
  playNote: (note: Note) => void;
}

export const WhitePianoKey = ({ note, playNote }: PianoKeyProps) => {
  return (
    <button
      className="border border-black rounded-sm bg-color-white active:scale-95 hover:bg-gray-100"
      style={{ width: "3rem", height: "12rem" }}
      data-note={note}
      onClick={(event) => {
        const { note } = event.currentTarget.dataset;

        if (!note) {
          throw new Error("No note found on key");
        }

        playNote(note as Note);
      }}
    >
      <span className="sr-only">{`piano key ${note}`}</span>
    </button>
  );
};

export const BlackPianoKey = ({ note, playNote }: PianoKeyProps) => {
  return (
    <button
      className="black-key active:scale-95 hover:bg-gray-100"
      data-note={note}
      onClick={(event) => {
        const { note } = event.currentTarget.dataset;

        if (!note) {
          throw new Error("No note found on key");
        }

        playNote(note as Note);
      }}
    >
      <span className="sr-only">{`piano key ${note}`}</span>
    </button>
  );
};
