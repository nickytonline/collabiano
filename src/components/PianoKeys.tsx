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

export type NoteMapKey<T extends Note> = T extends `${infer L}#${infer R}`
  ? `${Lowercase<L>}-sharp-${Lowercase<R>}`
  : Lowercase<T>;

interface PianoKeyProps {
  note: string;
  playNote: (note: Note) => void;
}

type LeftPosition = `left-[${number}px] md:left-[${number}px]`;

interface BlackPianoKeyProps extends PianoKeyProps {
  leftPosition: LeftPosition;
}

export const WhitePianoKey = ({ note, playNote }: PianoKeyProps) => {
  return (
    <button
      className="text-sm flex flex-col border border-black rounded-sm bg-color-white active:scale-95 hover:bg-gray-300 w-10 md:w-12 h-32 md:h-56"
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
      <span className="mt-auto p-1">{note}</span>
    </button>
  );
};

export const BlackPianoKey = ({
  note,
  leftPosition,
  playNote,
}: BlackPianoKeyProps) => {
  return (
    <button
      className={`text-sm flex flex-col border border-black rounded-sm bg-black active:scale-95 hover:bg-gray-300 w-8 md:w-10 h-20 md:h-36 absolute ${leftPosition}`}
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
      <span className="text-white mt-auto text-center p-1">{note}</span>
    </button>
  );
};
