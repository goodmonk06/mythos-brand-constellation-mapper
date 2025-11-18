'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type BrandPillar = {
  id: string
  key: string
  name: string
  descriptionMarkdown: string
  _count: { constellationLinks: number }
}

export default function PillarsPage() {
  const [pillars, setPillars] = useState<BrandPillar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPillars()
  }, [])

  const fetchPillars = async () => {
    try {
      const res = await fetch('/api/pillars?communityId=demo')
      const data = await res.json()
      setPillars(data.pillars || [])
    } catch (error) {
      console.error('Error fetching pillars:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl">Loading pillars...</div>
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
              🏛️ Brand Pillars
            </h1>
            <p className="text-gray-400 mt-2">
              Core brand values and content pillars
            </p>
          </div>
          <Link
            href="/pillars/new"
            className="px-6 py-3 bg-constellation-link text-white rounded-lg font-semibold hover:opacity-80 transition-opacity"
          >
            + New Pillar
          </Link>
        </div>

        {pillars.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <p className="text-xl text-gray-400">No pillars yet</p>
            <Link
              href="/pillars/new"
              className="text-constellation-link hover:underline mt-2 inline-block"
            >
              Create your first brand pillar
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <Link
                key={pillar.id}
                href={`/pillars/${pillar.id}`}
                className="p-6 border border-gray-700 rounded-lg hover:border-constellation-link transition-colors"
              >
                <h2 className="text-2xl font-semibold mb-3">{pillar.name}</h2>
                <p className="text-gray-400 mb-4 line-clamp-4">
                  {pillar.descriptionMarkdown}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-3 py-1 bg-constellation-link/20 text-constellation-link rounded-full">
                    Key: {pillar.key}
                  </span>
                  <span className="text-xs text-gray-500">
                    {pillar._count.constellationLinks} connection{pillar._count.constellationLinks !== 1 ? 's' : ''}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
