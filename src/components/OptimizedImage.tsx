import { useState } from "react"
import imageData from "../data/image-data.json"

interface OptimizedImageProps {
  src: string
  alt: string
  id: string
  className?: string
  onClick?: () => void
}

const imageMap = imageData as Record<
  string,
  { blur: string; width: number; height: number; srcset: Record<string, string> }
>

export function OptimizedImage({ src, alt, id, className = "", onClick }: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false)
  const data = imageMap[id]

  if (!data) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onClick={onClick}
        loading="lazy"
      />
    )
  }

  const srcsetEntries = Object.entries(data.srcset)
    .map(([size, url]) => `${url} ${size}w`)
    .join(", ")

  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

  return (
    <div
      className="relative overflow-hidden"
      style={{ aspectRatio: `${data.width}/${data.height}` }}
      onClick={onClick}
    >
      <img
        src={data.blur}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      <img
        src={src}
        srcSet={srcsetEntries || undefined}
        sizes={srcsetEntries ? sizes : undefined}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </div>
  )
}
