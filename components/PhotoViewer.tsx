"use client";

import { useState } from "react";
import Image from "next/image";

export type Photo = { src: string; alt: string; caption: string; focus?: string };

// One large photo with a caption and a row of thumbnails to switch between them.
// `ratio` is the frame's CSS aspect-ratio; `focus` on a photo keeps its subject in frame when it is cropped.
export function PhotoViewer({ photos, ratio = "3 / 2" }: { photos: Photo[]; ratio?: string }) {
  const [index, setIndex] = useState(0);
  const photo = photos[index];

  return (
    <div className="space-y-3">
      <div className="relative w-full overflow-hidden rounded-lg border border-muted bg-muted" style={{ aspectRatio: ratio }}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 640px"
          className="object-cover"
          style={{ objectPosition: photo.focus }}
        />
      </div>
      <p className="text-sm text-muted-foreground">{photo.caption}</p>
      {photos.length > 1 && (
        <ul className="grid gap-2" style={{ gridTemplateColumns: `repeat(${photos.length}, minmax(0, 1fr))` }}>
          {photos.map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Photo ${i + 1} of ${photos.length}: ${p.caption}`}
                aria-current={i === index}
                className={`relative block w-full overflow-hidden rounded-md border-2 transition-all aria-current:border-accent ${
                  i === index ? "" : "border-transparent opacity-60 hover:opacity-100"
                }`}
                style={{ aspectRatio: ratio }}
              >
                <Image src={p.src} alt="" fill sizes="160px" className="object-cover" style={{ objectPosition: p.focus }} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
