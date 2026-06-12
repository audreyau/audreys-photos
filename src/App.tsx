import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { Nav } from "./components/Nav"
import { Gallery } from "./pages/Gallery"
import { Collections } from "./pages/Collections"
import { CollectionDetail } from "./pages/CollectionDetail"
import { About } from "./pages/About"
import { NotFound } from "./pages/NotFound"

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Gallery />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<CollectionDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <Nav />
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
