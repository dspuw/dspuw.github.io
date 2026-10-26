// Looks up headshots by the file names stored in people.json and executive-board.json,
// and turns them into small, optimized images for the directory cards.
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

const folders = {
  brothers: import.meta.glob<{ default: ImageMetadata }>('../assets/images/brothers/*.{jpg,jpeg,png,webp}', { eager: true }),
  'executive-board': import.meta.glob<{ default: ImageMetadata }>('../assets/images/executive-board/*.{jpg,jpeg,png,webp}', {
    eager: true,
  }),
};

export type Folder = keyof typeof folders;

export function headshot(folder: Folder, file: string): ImageMetadata {
  const found = folders[folder][`../assets/images/${folder}/${file}`];
  if (!found) throw new Error(`Headshot "${file}" is missing from src/assets/images/${folder}`);
  return found.default;
}

export interface CardImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

/** A 4:5 crop in WebP at two sizes, enough for a card on any screen. */
export async function cardImage(folder: Folder, file: string): Promise<CardImage> {
  const image = await getImage({
    src: headshot(folder, file),
    format: 'webp',
    width: 480,
    height: 600,
    fit: 'cover',
    position: 'top',
    widths: [240, 480],
    quality: 78,
  });
  return {
    src: image.src,
    srcSet: image.srcSet.attribute,
    width: 480,
    height: 600,
  };
}
