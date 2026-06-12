import { useEffect } from "react"

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  path?: string
}

const SITE_NAME = "audrey's photos"

export function SEOHead({
  title,
  description = "A personal photography collection.",
  image,
  path: _path = "/",
}: SEOHeadProps) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME

  useEffect(() => {
    document.title = fullTitle

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) ||
        document.querySelector(`meta[name="${property}"]`)
      if (!el) {
        el = document.createElement("meta")
        if (property.startsWith("og:") || property.startsWith("twitter:")) {
          el.setAttribute("property", property)
        } else {
          el.setAttribute("name", property)
        }
        document.head.appendChild(el)
      }
      el.setAttribute("content", content)
    }

    setMeta("description", description)
    setMeta("og:title", fullTitle)
    setMeta("og:description", description)
    if (image) setMeta("og:image", image)
    setMeta("twitter:card", image ? "summary_large_image" : "summary")
    setMeta("twitter:title", fullTitle)
    setMeta("twitter:description", description)
    if (image) setMeta("twitter:image", image)
  }, [fullTitle, description, image])

  return null
}
