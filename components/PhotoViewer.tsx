"use client";

import { useState } from "react";
import Image from "next/image";

export type Photo = {
  src: string;
  alt: string;
  caption: string;
  focus?: string;
};

// One large photo with a caption and a row of thumbnails to switch between them.
// `ratio` is the frame's CSS aspect-ratio; `focus` on a photo keeps its subject in frame when it is cropped.
export function PhotoViewer({
  photos,
  ratio = "3 / 2",
}: {
  photos: Photo[];
  ratio?: string;
}) {
  const [index, setIndex] = useState(0);
  const photo = photos[index];

  return (
    <div className="photo-viewer">
      <div className="photo-frame" style={{ aspectRatio: ratio }}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 640px"
          className="object-cover"
          style={{ objectPosition: photo.focus }}
        />
      </div>
      <p className="photo-caption-text" aria-live="polite">
        {photo.caption}
      </p>
      {photos.length > 1 && (
        <ul className="photo-thumbnails" aria-label="Choose a photo">
          {photos.map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Photo ${i + 1} of ${photos.length}: ${p.caption}`}
                aria-current={i === index}
                className="photo-thumbnail"
              >
                <Image
                  src={p.src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                  style={{ objectPosition: p.focus }}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
