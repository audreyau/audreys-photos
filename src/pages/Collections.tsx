import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { collections } from "../data/photos"
import { OptimizedImage } from "../components/OptimizedImage"
import { ScrollReveal } from "../components/ScrollReveal"
import { PageTransition } from "../components/PageTransition"
import { SEOHead } from "../components/SEOHead"

export function Collections() {
  const [filter, setFilter] = useState<string>("all")

  const categories = useMemo(() => {
    const cats = new Set<string>()
    for (const c of collections) {
      if (c.category) cats.add(c.category)
    }
    return [...cats]
  }, [])

  const displayCollections = useMemo(() => {
    if (filter === "all") return collections
    return collections.filter((c) => c.category === filter)
  }, [filter])

  return (
    <PageTransition>
      <SEOHead
        title="Collections"
        description="My photos, grouped by shoot!"
        path="/collections"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 dark:text-white mb-2">
            Collections
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">
            My photos, grouped by shoot!
          </p>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
                All
              </FilterButton>
              {categories.map((cat) => (
                <FilterButton
                  key={cat}
                  active={filter === cat}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </FilterButton>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCollections.map((collection, index) => (
            <ScrollReveal key={collection.id} delay={index * 0.1}>
              <Link
                to={`/collections/${collection.id}`}
                className="group block"
              >
                <div className="overflow-hidden rounded-lg aspect-[4/3] relative flex items-center">
                  <OptimizedImage
                    id={decodeURIComponent(collection.coverPhoto.replace("/photos/", ""))}
                    src={collection.coverPhoto}
                    alt={collection.title}
                    className="w-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 className="text-white font-serif text-xl">
                      {collection.title}
                    </h2>
                    {collection.description && (
                      <p className="text-white/70 text-sm mt-1">
                        {collection.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
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
      className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
        active
          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
      }`}
    >
      {children}
    </button>
  )
}
