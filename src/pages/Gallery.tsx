import { useState, useMemo, use } from "react"
import { photos, collections } from "../data/photos"
import { MasonryGallery } from "../components/MasonryGallery"
import { PageTransition } from "../components/PageTransition"
import { SEOHead } from "../components/SEOHead"

export function Gallery() {
  const [filter, setFilter] = useState<string>("featured")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const catMap = new Map<string, typeof collections>()
    const uncategorized: typeof collections = []

    for (const c of collections) {
      if (c.category) {
        const existing = catMap.get(c.category) || []
        existing.push(c)
        catMap.set(c.category, existing)
      } else {
        uncategorized.push(c)
      }
    }

    return { grouped: catMap, uncategorized }
  }, [])

  const displayPhotos = useMemo(() => {
    if (filter === "featured") {
      const featured = photos.filter((p) => p.featured)
      return featured.length > 0 ? featured : photos
    }
    if (filter === "all") return photos

    const categoryCollections = categories.grouped.get(filter)
    if (categoryCollections) {
      const collectionIds = new Set(categoryCollections.map((c) => c.id))
      return photos.filter((p) => p.collection && collectionIds.has(p.collection))
    }

    return photos.filter((p) => p.collection === filter)
  }, [filter, categories])

  const handleCategoryClick = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null)
      setFilter("featured")
    } else {
      setExpandedCategory(category)
      setFilter(category)
    }
  }

  const handleSubFilterClick = (collectionId: string) => {
    setFilter(collectionId)
  }

  return (
    <PageTransition>
      <SEOHead
        title="Gallery"
        description="Some of my favorite photos!"
        path="/"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 dark:text-white mb-2">
            Gallery
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">
            Some of my favorite photos!
          </p>

          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={filter === "featured"}
              onClick={() => { setFilter("featured"); setExpandedCategory(null) }}
            >
              Highlights
            </FilterButton>
            {/* <FilterButton
              active={filter === "all"}
              onClick={() => { setFilter("all"); setExpandedCategory(null) }}
            >
              All
            </FilterButton> */}
            
            {[...categories.grouped.keys()].map((category) => (
              <FilterButton
                key={category}
                  active={expandedCategory === category}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </FilterButton>
            ))}

            {categories.uncategorized.map((c) => (
              <FilterButton
                key={c.id}
                active={filter === c.id}
                onClick={() => { setFilter(c.id); setExpandedCategory(null) }}
              >
                {c.title}
              </FilterButton>
            ))}
          </div>

          {expandedCategory && categories.grouped.get(expandedCategory) && (
            <div className="flex flex-wrap gap-2 mt-3 pl-2 border-l-2 border-neutral-200 dark:border-neutral-700">
              {categories.grouped.get(expandedCategory)!.map((c) => (
                <FilterButton
                  key={c.id}
                  active={filter === c.id}
                  onClick={() => handleSubFilterClick(c.id)}
                >
                  {c.title}
                </FilterButton>
              ))}
            </div>
          )}

        </div>

        <MasonryGallery photos={displayPhotos} />
      </div>
    </PageTransition>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm transition-colors cursor-pointer ${
        active
          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
      }`}
    >
      {children}
    </button>
  )
}
