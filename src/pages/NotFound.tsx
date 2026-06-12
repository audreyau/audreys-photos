import { Link } from "react-router-dom"
import { PageTransition } from "../components/PageTransition"
import { SEOHead } from "../components/SEOHead"

export function NotFound() {
  return (
    <PageTransition>
      <SEOHead title="Not Found" path="/404" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="font-serif text-5xl sm:text-6xl text-neutral-900 dark:text-white mb-4">
          404
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">
          Nothing here. Maybe it moved, maybe it never existed.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm transition-opacity hover:opacity-80"
        >
          Back to gallery
        </Link>
      </div>
    </PageTransition>
  )
}
