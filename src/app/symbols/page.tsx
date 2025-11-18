'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type MythicSymbol = {
  id: string
  key: string
  name: string
  category: string
  descriptionMarkdown: string
  _count: { constellationLinks: number }
}

const CATEGORY_ICONS: Record<string, string> = {
  animal: '🦅',
  element: '🔥',
  object: '⚔️',
  myth_figure: '👑',
  archetype: '🎭',
  other: '✨',
}

export default function SymbolsPage() {
  const [symbols, setSymbols] = useState<MythicSymbol[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    fetchSymbols()
  }, [selectedCategory])

  const fetchSymbols = async () => {
    try {
      const params = new URLSearchParams({ communityId: 'demo' })
      if (selectedCategory) params.append('category', selectedCategory)

      const res = await fetch(`/api/symbols?${params}`)
      const data = await res.json()
      setSymbols(data.symbols || [])
    } catch (error) {
      console.error('Error fetching symbols:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl">Loading symbols...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-gray-400 hover:text-white mb-2 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold constellation-glow">
              🌟 Mythic Symbols
            </h1>
            <p className="text-gray-400 mt-2">
              Archetypes, animals, elements, and mythic figures
            </p>
          </div>
          <Link
            href="/symbols/new"
            className="px-6 py-3 bg-constellation-star text-constellation-bg rounded-lg font-semibold hover:opacity-80 transition-opacity"
          >
            + New Symbol
          </Link>
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Filter by category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="">All Categories</option>
            <option value="animal">🦅 Animal</option>
            <option value="element">🔥 Element</option>
            <option value="object">⚔️ Object</option>
            <option value="myth_figure">👑 Myth Figure</option>
            <option value="archetype">🎭 Archetype</option>
            <option value="other">✨ Other</option>
          </select>
        </div>

        {symbols.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <p className="text-xl text-gray-400">No symbols yet</p>
            <Link
              href="/symbols/new"
              className="text-constellation-link hover:underline mt-2 inline-block"
            >
              Create your first mythic symbol
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {symbols.map((symbol) => (
              <Link
                key={symbol.id}
                href={`/symbols/${symbol.id}`}
                className="p-6 border border-gray-700 rounded-lg hover:border-constellation-star transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{CATEGORY_ICONS[symbol.category]}</span>
                  <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">
                    {symbol.category}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{symbol.name}</h2>
                <p className="text-gray-400 text-sm line-clamp-3">
                  {symbol.descriptionMarkdown}
                </p>
                <div className="mt-4 text-xs text-gray-500">
                  {symbol._count.constellationLinks} connection{symbol._count.constellationLinks !== 1 ? 's' : ''}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
