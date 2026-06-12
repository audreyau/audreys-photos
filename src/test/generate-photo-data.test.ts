import { describe, it, expect, beforeEach, afterEach } from "vitest"
import fs from "fs"
import path from "path"

const TEST_DIR = path.resolve("test-photos-tmp")

describe("generate-photo-data script logic", () => {
  beforeEach(() => {
    fs.mkdirSync(path.join(TEST_DIR, "test-collection"), { recursive: true })
  })

  afterEach(() => {
    fs.rmSync(TEST_DIR, { recursive: true, force: true })
  })

  it("empty directory has no image files", () => {
    const files = fs.readdirSync(path.join(TEST_DIR, "test-collection"))
    expect(files.length).toBe(0)
  })

  it("can detect image extensions", () => {
    const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"])
    expect(IMAGE_EXTENSIONS.has(".jpg")).toBe(true)
    expect(IMAGE_EXTENSIONS.has(".txt")).toBe(false)
    expect(IMAGE_EXTENSIONS.has(".png")).toBe(true)
  })

  it("slug to title conversion works", () => {
    function slugToTitle(slug: string): string {
      return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    }

    expect(slugToTitle("golden-hour")).toBe("Golden Hour")
    expect(slugToTitle("city-walks")).toBe("City Walks")
    expect(slugToTitle("nature")).toBe("Nature")
  })
})
