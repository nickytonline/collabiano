import { useState } from "react";
import type { Note } from "./PianoKeys";

interface AlbumArtProps {
  generateAlbumArt: (notes: Note[]) => Promise<string>;
  notes: Note[];
}

export const AlbumArt = ({ generateAlbumArt, notes }: AlbumArtProps) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [generatingAlbumArt, setGeneratingAbumArt] = useState(false);

  return (
    <details>
      <summary className="text-2xl">Album Art Creator</summary>
      <p className="py-2">
        Generate album art. The art is based off of the last 10 notes that were
        played by anyone.
      </p>
      <form className="grid gap-4">
        <button
          onClick={async (event) => {
            event.preventDefault();
            setImageUrl(undefined);
            setGeneratingAbumArt(true);
            setImageUrl(await generateAlbumArt(notes));
          }}
          className="inline-flex items-center px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-max"
        >
          Generate Album Art
        </button>
        {imageUrl ? (
          <a
            href={imageUrl}
            download={new URL(imageUrl).pathname.split("/")[-1]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={imageUrl}
              alt={`album art generated from these notes played, ${notes.join(
                ", "
              )}`}
              width="300"
              className="aspect-w-1 aspect-h-1 rounded-md"
            />
          </a>
        ) : generatingAlbumArt ? (
          <div
            className="loading rounded-md"
            style={{ width: "300px", aspectRatio: "1/1" }}
          />
        ) : null}
      </form>
    </details>
  );
};
