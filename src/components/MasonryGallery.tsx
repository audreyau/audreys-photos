import { useState } from "react"
import type { Photo } from "../data/photos"
import { Lightbox } from "./Lightbox"
import { OptimizedImage } from "./OptimizedImage"
import { ScrollReveal } from "./ScrollReveal"

interface MasonryGalleryProps {
  photos: Photo[]
}

export function MasonryGallery({ photos }: MasonryGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  return (
    <>
      <div className="masonry-grid">
        {photos.map((photo, index) => (
          <ScrollReveal key={photo.id} delay={Math.min(index * 0.05, 0.3)}>
            <div
              className="masonry-item group cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
              role="button"
              tabIndex={0}
              aria-label={`View photo: ${photo.alt}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setSelectedPhoto(photo)
                }
              }}
            >
              <div className="overflow-hidden rounded-lg">
                <OptimizedImage
                  id={photo.id}
                  src={photo.src}
                  alt={photo.alt}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <Lightbox
        photo={selectedPhoto}
        photos={photos}
        onClose={() => setSelectedPhoto(null)}
        onNavigate={setSelectedPhoto}
      />
    </>
  )
}
