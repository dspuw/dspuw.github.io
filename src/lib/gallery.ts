// Turns the photos listed in gallery.json into optimized thumbnails and full-size images.
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { gallery } from './data';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/images/gallery/*.{jpg,jpeg,png,webp}', {
  eager: true,
});

export interface GalleryPhoto {
  alt: string;
  category: string;
  event: string;
  width: number;
  height: number;
  thumb: { src: string; srcSet: string };
  full: { src: string; srcSet: string };
}

export async function galleryPhotos(): Promise<GalleryPhoto[]> {
  return Promise.all(
    gallery.photos.map(async (photo) => {
      const file = files[`../assets/images/gallery/${photo.image}`];
      if (!file) throw new Error(`Gallery photo "${photo.image}" is missing from src/assets/images/gallery`);
      const source = file.default;
      const thumb = await getImage({ src: source, format: 'webp', width: 800, widths: [400, 800], quality: 78 });
      const full = await getImage({ src: source, format: 'webp', width: Math.min(source.width, 1800), widths: [1000, Math.min(source.width, 1800)], quality: 82 });
      return {
        alt: photo.alt,
        category: photo.category,
        event: photo.event,
        width: source.width,
        height: source.height,
        thumb: { src: thumb.src, srcSet: thumb.srcSet.attribute },
        full: { src: full.src, srcSet: full.srcSet.attribute },
      };
    }),
  );
}
