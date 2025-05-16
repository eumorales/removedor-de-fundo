import { Github } from "lucide-react"
import BackgroundRemover from "@/components/background-remover"
import { PerspectiveGrid } from "@/components/perspective-grid"

export default function Home() {
  return (
    <main className="min-h-screen bg-white relative">

      <div className="absolute inset-0" style={{ height: "60vh", zIndex: 0, overflow: "hidden" }}>
        <PerspectiveGrid />
      </div>

      <div
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:py-0"
        style={{ zIndex: 1 }}
      >
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-2 sm:mb-4 text-gray-900 animate-text-gradient">
            removedor de fundo.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-12 animate-fade-in">
            Imagens limpas e prontas em um clique!
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto">
          <BackgroundRemover />
        </div>
      </div>

      <footer
        className="py-6 sm:py-8 flex items-center justify-center space-x-4 text-xs sm:text-sm text-gray-500 relative"
        style={{ zIndex: 1 }}
      >
        <p>All work © {new Date().getFullYear()} Gilberto Morales</p>
        <a
          href="https://github.com/eumorales"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
          aria-label="GitHub"
        >
          <Github size={16} className="text-gray-700" />
        </a>
      </footer>
    </main>
  )
}
