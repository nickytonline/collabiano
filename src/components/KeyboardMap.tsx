import { useEffect } from "react";
import type { Note } from "./PianoKeys";

interface KeyboardMapProps {
  keyMap: Record<string, Note>;
  onKeyPress: (event: KeyboardEvent) => void;
}

export const KeyboardMap = ({ keyMap, onKeyPress }: KeyboardMapProps) => {
  useEffect(() => {
    document.body.addEventListener("keypress", onKeyPress);

    return () => {
      document.body.removeEventListener("keypress", onKeyPress);
    };
  }, [keyMap]);

  return (
    <details>
      <summary className="cursor-pointer text-2xl">Keyboard map</summary>
      <p className="py-2">
        Press the following keys to play the following notes
      </p>
      <ul className="flex flex-wrap max-w-96 gap-4 border p-2">
        {Object.entries(keyMap).map(([key, note]) => (
          <li key={key}>
            {key}: {note}
          </li>
        ))}
      </ul>
    </details>
  );
};
