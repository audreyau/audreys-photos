import { useParams, Link } from "react-router-dom"
import { photos, collections } from "../data/photos"
import { MasonryGallery } from "../components/MasonryGallery"
import { PageTransition } from "../components/PageTransition"
import { SEOHead } from "../components/SEOHead"

export function CollectionDetail() {
  const { id } = useParams<{ id: string }>()
  const collection = collections.find((c) => c.id === id)
  const collectionPhotos = photos.filter((p) => p.collection === id)

  if (!collection) {
    return (
      <PageTransition>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center">
          <p className="text-neutral-500">Collection not found.</p>
          <Link
            to="/collections"
            className="text-neutral-900 dark:text-white underline mt-4 inline-block"
          >
            Back to collections
          </Link>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <SEOHead
        title={collection.title}
        description={collection.description || `Photos from ${collection.title}`}
        image={collection.coverPhoto}
        path={`/collections/${collection.id}`}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link
          to="/collections"
          className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-6 inline-block"
        >
          &larr; All collections
        </Link>

        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 dark:text-white mb-2">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-neutral-500 dark:text-neutral-400">
              {collection.description}
            </p>
          )}
          <p className="text-neutral-400 text-sm mt-2">
            {collectionPhotos.length} photo{collectionPhotos.length !== 1 ? "s" : ""}
          </p>
        </div>

        <MasonryGallery photos={collectionPhotos} />
      </div>
    </PageTransition>
  )
}
