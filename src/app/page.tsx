import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 constellation-glow">
          ✨ Mythos Brand Constellation Mapper
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Map your community's myths, symbols, and brand pillars as interconnected constellations
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/symbols"
            className="p-6 border border-gray-700 rounded-lg hover:border-constellation-star transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">🌟 Mythic Symbols</h2>
            <p className="text-gray-400">
              Explore archetypes, animals, elements, and mythic figures
            </p>
          </Link>

          <Link
            href="/pillars"
            className="p-6 border border-gray-700 rounded-lg hover:border-constellation-link transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">🏛️ Brand Pillars</h2>
            <p className="text-gray-400">
              Define your core brand values and content pillars
            </p>
          </Link>

          <Link
            href="/constellation"
            className="p-6 border border-gray-700 rounded-lg hover:border-purple-500 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">🌌 Constellation View</h2>
            <p className="text-gray-400">
              Visualize the connections between myths and brand
            </p>
          </Link>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">What is a Brand Constellation?</h3>
          <p className="text-gray-300 leading-relaxed">
            A brand constellation maps the mythic symbols, archetypes, and narratives that
            resonate with your community, linking them to your brand's core pillars. This
            creates a rich tapestry of meaning that can guide content creation, design
            decisions, and storytelling across all touchpoints.
          </p>
        </div>
      </div>
    </main>
  )
}
