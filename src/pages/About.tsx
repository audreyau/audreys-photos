import { PageTransition } from "../components/PageTransition"
import { SEOHead } from "../components/SEOHead"

export function About() {
  return (
    <PageTransition>
      <SEOHead
        title="About"
        description="Audrey's photography page!"
        path="/about"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 dark:text-white mb-6">
          About
        </h1>

        <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <p>
            Hey, I'm Audrey! I like taking photos of the world around me.
          </p>
          <p>
            I recently got a digital camera for my birthday and have been carrying it everywhere since.
          </p>
          <p>
            This site is a place to put the ones I like. Hope you enjoy
            them!
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="font-serif text-xl text-neutral-900 dark:text-white mb-4">
            About this site
          </h2>
          <ul className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
            <li>Built with React, TypeScript, and Tailwind CSS</li>
            <li>Images auto-optimized to WebP with responsive srcsets</li>
            <li>Blur-up placeholders for instant perceived loading</li>
            <li>Works offline (Progressive Web App)</li>
            <li>Lighthouse performance score: 💯</li>
          </ul>
        </div>
      </div>
    </PageTransition>
  )
}
