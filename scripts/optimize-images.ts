import * as fs from "fs"
import * as path from "path"
import sharp from "sharp"

const PHOTOS_DIR = path.resolve("public/photos")
const OUTPUT_DIR = path.resolve("public/photos-optimized")
const IMAGE_DATA_OUTPUT = path.resolve("src/data/image-data.json")

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"])
const SIZES = [400, 800, 1200, 1920]
const BLUR_SIZE = 20

async function generateBlurPlaceholder(filePath: string): Promise<string> {
  const buffer = await sharp(filePath)
    .resize(BLUR_SIZE, BLUR_SIZE, { fit: "inside" })
    .jpeg({ quality: 30 })
    .blur()
    .toBuffer()

  return `data:image/jpeg;base64,${buffer.toString("base64")}`
}

async function processImage(
  srcPath: string,
  relativePath: string
): Promise<{ blur: string; width: number; height: number; srcset: Record<number, string> }> {
  const metadata = await sharp(srcPath).metadata()
  const width = metadata.width || 1920
  const height = metadata.height || 1080

  const parsedRel = path.parse(relativePath)
  const relativeDir = path.dirname(relativePath)
  const baseName = parsedRel.name
  const outputDir = path.join(OUTPUT_DIR, relativeDir)

  fs.mkdirSync(outputDir, { recursive: true })

  const srcset: Record<number, string> = {}

  for (const size of SIZES) {
    if (size > width) continue

    const webpFileName = `${baseName}-${size}w.webp`
    const webpPath = path.join(outputDir, webpFileName)
    const webpRelative = path.join("/photos-optimized", relativeDir, webpFileName).replace(/\\/g, "/")
    const webpEncoded = webpRelative.split("/").map((s) => encodeURIComponent(s)).join("/")

    await sharp(srcPath)
      .resize(size, undefined, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(webpPath)

    srcset[size] = webpEncoded
  }

  const blur = await generateBlurPlaceholder(srcPath)

  return { blur, width, height, srcset }
}

async function optimizeAll() {
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.log("No public/photos/ directory found. Skipping optimization.")
    fs.mkdirSync(path.dirname(IMAGE_DATA_OUTPUT), { recursive: true })
    if (!fs.existsSync(IMAGE_DATA_OUTPUT)) fs.writeFileSync(IMAGE_DATA_OUTPUT, "{}")
    return
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  fs.mkdirSync(path.dirname(IMAGE_DATA_OUTPUT), { recursive: true })

  const imageDataMap: Record<string, { blur: string; width: number; height: number; srcset: Record<number, string> }> = {}

  const allFiles: { srcPath: string; relativePath: string; id: string }[] = []

  const entries = fs.readdirSync(PHOTOS_DIR, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === "config.json") continue
    if (entry.name === ".DS_Store") continue
    const entryPath = path.join(PHOTOS_DIR, entry.name)

    if (!entry.isDirectory()) {
      if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        allFiles.push({ srcPath: entryPath, relativePath: entry.name, id: entry.name })
      }
      continue
    }

    const files = fs
      .readdirSync(entryPath)
      .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))

    for (const file of files) {
      const filePath = path.join(entryPath, file)
      const relativePath = `${entry.name}/${file}`
      allFiles.push({ srcPath: filePath, relativePath, id: relativePath })
    }
  }

  if (allFiles.length === 0) {
    console.log("No images found. Writing empty data file.")
    fs.writeFileSync(IMAGE_DATA_OUTPUT, "{}")
    return
  }

  console.log(`Optimizing ${allFiles.length} image(s)...`)

  for (const { srcPath, relativePath, id } of allFiles) {
    process.stdout.write(`  ${relativePath}...`)
    const imageData = await processImage(srcPath, relativePath)
    imageDataMap[id] = imageData
    console.log(" done")
  }

  fs.writeFileSync(IMAGE_DATA_OUTPUT, JSON.stringify(imageDataMap, null, 2))

  console.log(`\nDone! Optimized ${allFiles.length} images.`)
  console.log(`  Output: public/photos-optimized/`)
}

optimizeAll().catch(console.error)
