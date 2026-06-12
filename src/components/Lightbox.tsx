import { useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Photo } from "../data/photos"

interface LightboxProps {
  photo: Photo | null
  photos: Photo[]
  onClose: () => void
  onNavigate: (photo: Photo) => void
}

export function Lightbox({ photo, photos, onClose, onNavigate }: LightboxProps) {
  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const goNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onNavigate(photos[currentIndex + 1])
    }
  }, [currentIndex, photos, onNavigate])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(photos[currentIndex - 1])
    }
  }, [currentIndex, photos, onNavigate])

  useEffect(() => {
    if (!photo) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKey)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKey)
    }
  }, [photo, onClose, goNext, goPrev])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return

    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = e.changedTouches[0].clientY - touchStartY.current

    // Only register horizontal swipes (not vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) goPrev()
      else goNext()
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo: ${photo.alt}`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl z-10 cursor-pointer"
            aria-label="Close lightbox"
          >
            &times;
          </button>

          {currentIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              className="absolute left-4 text-white/70 hover:text-white text-4xl z-10 cursor-pointer hidden sm:block"
              aria-label="Previous photo"
            >
              &#8249;
            </button>
          )}

          {currentIndex < photos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className="absolute right-4 text-white/70 hover:text-white text-4xl z-10 cursor-pointer hidden sm:block"
              aria-label="Next photo"
            >
              &#8250;
            </button>
          )}

          <motion.img
            key={photo.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            src={photo.src}
            alt={photo.alt}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-white/60 text-sm">
              {currentIndex + 1} / {photos.length}
            </div>
            <p className="text-white/40 text-xs mt-1 sm:hidden">
              Swipe to navigate
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
