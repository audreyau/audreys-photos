import * as fs from "fs"
import * as path from "path"

const PHOTOS_DIR = path.resolve("public/photos")
const CONFIG_FILE = path.join(PHOTOS_DIR, "config.json")
const OUTPUT_FILE = path.resolve("src/data/photos.ts")

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"])

interface PhotoEntry {
  id: string
  src: string
  alt: string
  collection?: string
  featured?: boolean
}

interface CollectionEntry {
  id: string
  title: string
  description?: string
  coverPhoto: string
  category?: string
}

interface Config {
  gallery?: string[]
  collections?: Record<
    string,
    { cover?: string; description?: string; category?: string; }
  >
}

function encodePhotoPath(filePath: string): string {
  return filePath
    .split("/")
    .map((segment) => encodeURIComponent(segment).replace(/%2B/g, "+"))
    .join("/")
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function loadConfig(): Config {
  if (!fs.existsSync(CONFIG_FILE)) return {}
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"))
  } catch (e) {
    console.warn("Warning: could not parse config.json, using defaults.", e)
    return {}
  }
}

/**
 * Resolves gallery config entries into a set of featured photo IDs.
 * Supports:
 *   "collection-name"           → all photos from that collection
 *   "collection-name:5"         → first 5 photos from that collection
 *   "collection-name/file.jpg"  → specific photo
 */
function resolveGallery(
  galleryConfig: string[],
  collectionFiles: Map<string, string[]>
): { featuredSet: Set<string>; orderedIds: string[] } {
  const orderedIds: string[] = []
  const featuredSet = new Set<string>()

  for (const entry of galleryConfig) {
    // Check if it's a specific file (contains a file extension)
    if (/\.\w+$/.test(entry) && entry.includes("/")) {
      orderedIds.push(entry)
      featuredSet.add(entry)
      continue
    }

    // It's a collection reference, possibly with a limit
    const [collectionId, limitStr] = entry.split(":")
    const limit = limitStr ? parseInt(limitStr, 10) : Infinity
    const files = collectionFiles.get(collectionId) || []

    const selectedFiles = files.slice(0, limit)
    for (const file of selectedFiles) {
      const id = `${collectionId}/${file}`
      orderedIds.push(id)
      featuredSet.add(id)
    }
  }

  return { featuredSet, orderedIds }
}

function generatePhotoData() {
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.log("No public/photos/ directory found. Skipping generation.")
    return
  }

  const config = loadConfig()
  const photos: PhotoEntry[] = []
  const collections: CollectionEntry[] = []

  // First pass: collect all files per collection
  const collectionFiles = new Map<string, string[]>()
  const entries = fs.readdirSync(PHOTOS_DIR, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        collectionFiles.set("", [...(collectionFiles.get("") || []), entry.name])
      }
      continue
    }

    const collectionId = entry.name
    const collectionPath = path.join(PHOTOS_DIR, collectionId)
    const files = fs
      .readdirSync(collectionPath)
      .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort()

    if (files.length > 0) {
      collectionFiles.set(collectionId, files)
    }
  }

  // Resolve gallery config
  const galleryConfig = config.gallery || []
  const { featuredSet, orderedIds } = resolveGallery(galleryConfig, collectionFiles)

  // Second pass: build photo and collection arrays
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        photos.push({
          id: entry.name,
          src: encodePhotoPath(`/photos/${entry.name}`),
          alt: path.parse(entry.name).name.replace(/[-_]/g, " "),
          featured: featuredSet.size === 0 || featuredSet.has(entry.name),
        })
      }
      continue
    }

    const collectionId = entry.name
    const collectionConfig = config.collections?.[collectionId]
    const files = collectionFiles.get(collectionId)
    if (!files || files.length === 0) continue

    let coverFile = files[0]
    if (collectionConfig?.cover && files.includes(collectionConfig.cover)) {
      coverFile = collectionConfig.cover
    }

    collections.push({
      id: collectionId,
      title: slugToTitle(collectionId),
      description: collectionConfig?.description,
      category: collectionConfig?.category,
      coverPhoto: encodePhotoPath(`/photos/${collectionId}/${coverFile}`)
    })

    for (const file of files) {
      const photoId = `${collectionId}/${file}`
      photos.push({
        id: photoId,
        src: encodePhotoPath(`/photos/${collectionId}/${file}`),
        alt: path.parse(file).name.replace(/[-_]/g, " "),
        collection: collectionId,
        featured: featuredSet.size === 0 || featuredSet.has(photoId),
      })
    }
  }

  if (photos.length === 0) {
    console.log("No photos found in public/photos/. Keeping existing data file.")
    return
  }

  // Sort featured photos to match the gallery order from config
  photos.sort((a, b) => {
    if (a.featured && b.featured) {
      const aIdx = orderedIds.indexOf(a.id)
      const bIdx = orderedIds.indexOf(b.id)
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
      if (aIdx !== -1) return -1
      if (bIdx !== -1) return 1
    }
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return 0
  })

  const output = `// Auto-generated by scripts/generate-photo-data.ts
// Run: npm run photos
//
// Configure gallery highlights and collection covers in public/photos/config.json

export interface Photo {
  id: string
  src: string
  alt: string
  collection?: string
  featured?: boolean
}

export interface Collection {
  id: string
  title: string
  description?: string
  coverPhoto: string
  category?: string
}

export const collections: Collection[] = ${JSON.stringify(collections, null, 2)}

export const photos: Photo[] = ${JSON.stringify(photos, null, 2)}
`

  fs.writeFileSync(OUTPUT_FILE, output)
  console.log(
    `Generated ${photos.length} photo(s) in ${collections.length} collection(s) → src/data/photos.ts`
  )
  const featuredCount = photos.filter((p) => p.featured).length
  if (galleryConfig.length > 0) {
    console.log(`  Gallery highlights: ${featuredCount} photo(s) in custom order`)
  }
}

generatePhotoData()
