import { useState } from "react";
import type { Note } from "./PianoKeys";
import type { Animal, MusicGenre } from "./Piano";

interface AlbumArtProps {
  generateAlbumArt: (options: {
    notes: Note[];
    musicGenre: string;
    animal: Animal;
  }) => Promise<string>;
  notes: Note[];
  musicGenres: MusicGenre[];
  animals: Animal[];
}

export const AlbumArt = ({
  generateAlbumArt,
  notes,
  musicGenres,
  animals,
}: AlbumArtProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [generatingAlbumArt, setGeneratingAbumArt] = useState(false);
  const [musicGenre, setMusicGenre] = useState<MusicGenre>(musicGenres[0]);
  const [animal, setAnimal] = useState<Animal>(animals[0]);

  return (
    <details>
      <summary className="cursor-pointer text-2xl">Album Art Creator</summary>
      <p className="py-2">
        Album art is based off the last ten notes and the filters below
      </p>
      <form className="grid gap-4">
        <label className="flex gap-2 items-center">
          Genre
          <select
            className="w-max border p-1"
            onChange={(event) => {
              event.preventDefault();
              setMusicGenre(event.target.value as MusicGenre);
            }}
          >
            {musicGenres.map((genre: string) => (
              <option key={genre}>{genre}</option>
            ))}
          </select>
        </label>
        <label className="flex gap-2 items-center">
          Animal
          <select
            className="w-max border p-1"
            onChange={(event) => {
              event.preventDefault();
              setAnimal(event.target.value as Animal);
            }}
          >
            {animals.map((animal: string) => (
              <option key={animal}>{animal}</option>
            ))}
          </select>
        </label>
        <button
          onClick={async (event) => {
            event.preventDefault();
            setHasImageError(false);
            setImageUrl(undefined);
            setGeneratingAbumArt(true);
            let imageUrl: string | undefined;

            try {
              imageUrl = await generateAlbumArt({ notes, musicGenre, animal });
              setImageUrl(imageUrl);
            } catch (error) {
              setHasImageError(true);
              console.error(error);
            } finally {
              setGeneratingAbumArt(false);
            }
          }}
          className={`inline-flex items-center px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-max ${
            generatingAlbumArt ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={generatingAlbumArt}
        >
          Generate Album Art
        </button>
        <div aria-live="assertive">
          {hasImageError ? (
            <p className="text-red-500">
              There was an error generating the album art. Please try again.
            </p>
          ) : null}
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
              className="loading rounded-md aspect-square"
              style={{ width: "300px" }}
            />
          ) : null}
        </div>
      </form>
    </details>
  );
};
