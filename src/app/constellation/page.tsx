'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Node = {
  id: string
  type: 'symbol' | 'pillar'
  name: string
  key: string
  category?: string
  linkCount: number
}

type Edge = {
  id: string
  source: string
  target: string
  linkType: 'core' | 'supporting' | 'shadow'
  notes: string
}

type ConstellationData = {
  graph: {
    nodes: Node[]
    edges: Edge[]
  }
  matrix: {
    symbols: Array<{ id: string; name: string; category: string }>
    pillars: Array<{ id: string; name: string }>
    cells: Array<{ symbolId: string; pillarId: string; linkType: string; linkId: string }>
  }
  stats: {
    symbolCount: number
    pillarCount: number
    linkCount: number
  }
}

const LINK_TYPE_COLORS = {
  core: '#ffd700',
  supporting: '#4a90e2',
  shadow: '#9333ea',
}

export default function ConstellationPage() {
  const [data, setData] = useState<ConstellationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'network' | 'matrix'>('network')

  useEffect(() => {
    fetchConstellation()
  }, [])

  const fetchConstellation = async () => {
    try {
      const res = await fetch('/api/constellation?communityId=demo')
      const result = await res.json()
      setData(result.constellation)
    } catch (error) {
      console.error('Error fetching constellation:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl">Loading constellation...</div>
      </div>
    )
  }

  if (!data || data.stats.linkCount === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-gray-400 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-8 constellation-glow">
            🌌 Constellation View
          </h1>
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <p className="text-xl text-gray-400 mb-4">No constellation data yet</p>
            <p className="text-gray-500">
              Create symbols, pillars, and links to visualize your brand constellation
            </p>
            <div className="mt-6 flex gap-4 justify-center">
              <Link href="/symbols" className="text-constellation-link hover:underline">
                Add Symbols
              </Link>
              <Link href="/pillars" className="text-constellation-link hover:underline">
                Add Pillars
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-white mb-4 inline-block">
          ← Back to Home
        </Link>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold constellation-glow">
              🌌 Constellation View
            </h1>
            <div className="flex gap-6 mt-3 text-sm text-gray-400">
              <span>⭐ {data.stats.symbolCount} symbols</span>
              <span>🏛️ {data.stats.pillarCount} pillars</span>
              <span>🔗 {data.stats.linkCount} connections</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('network')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                view === 'network'
                  ? 'bg-constellation-star text-constellation-bg'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Network View
            </button>
            <button
              onClick={() => setView('matrix')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                view === 'matrix'
                  ? 'bg-constellation-star text-constellation-bg'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Matrix View
            </button>
          </div>
        </div>

        {view === 'network' ? (
          <NetworkView data={data.graph} />
        ) : (
          <MatrixView data={data.matrix} />
        )}
      </div>
    </div>
  )
}

function NetworkView({ data }: { data: ConstellationData['graph'] }) {
  const width = 1000
  const height = 600

  // Simple force-directed layout (simplified version)
  const symbols = data.nodes.filter(n => n.type === 'symbol')
  const pillars = data.nodes.filter(n => n.type === 'pillar')

  const symbolPositions = symbols.map((s, i) => ({
    ...s,
    x: 200 + (i % 5) * 120,
    y: 100 + Math.floor(i / 5) * 100,
  }))

  const pillarPositions = pillars.map((p, i) => ({
    ...p,
    x: 600 + (i % 3) * 150,
    y: 100 + Math.floor(i / 3) * 120,
  }))

  const allPositions = [...symbolPositions, ...pillarPositions]
  const nodeMap = new Map(allPositions.map(n => [n.id, n]))

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
      <div className="mb-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-constellation-star"></div>
          <span>Core</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-constellation-link"></div>
          <span>Supporting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LINK_TYPE_COLORS.shadow }}></div>
          <span>Shadow</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={width} height={height} className="border border-gray-800 rounded">
          {/* Links */}
          <g>
            {data.edges.map((edge) => {
              const source = nodeMap.get(edge.source)
              const target = nodeMap.get(edge.target)
              if (!source || !target) return null

              return (
                <line
                  key={edge.id}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={LINK_TYPE_COLORS[edge.linkType]}
                  strokeWidth={2}
                  opacity={0.6}
                />
              )
            })}
          </g>

          {/* Nodes */}
          <g>
            {allPositions.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.type === 'symbol' ? 8 : 10}
                  fill={node.type === 'symbol' ? '#ffd700' : '#4a90e2'}
                  stroke="#fff"
                  strokeWidth={2}
                />
                <text
                  x={node.x}
                  y={node.y + 25}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="12"
                  fontWeight={node.type === 'pillar' ? 'bold' : 'normal'}
                >
                  {node.name.length > 15 ? node.name.slice(0, 12) + '...' : node.name}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      <p className="text-sm text-gray-400 mt-4">
        💡 Network shows connections between mythic symbols (gold) and brand pillars (blue)
      </p>
    </div>
  )
}

function MatrixView({ data }: { data: ConstellationData['matrix'] }) {
  const getLinkType = (symbolId: string, pillarId: string) => {
    const cell = data.cells.find(c => c.symbolId === symbolId && c.pillarId === pillarId)
    return cell?.linkType || null
  }

  const getLinkTypeColor = (linkType: string | null) => {
    if (!linkType) return 'transparent'
    return LINK_TYPE_COLORS[linkType as keyof typeof LINK_TYPE_COLORS]
  }

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700 overflow-x-auto">
      <div className="mb-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: LINK_TYPE_COLORS.core }}></div>
          <span>Core</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: LINK_TYPE_COLORS.supporting }}></div>
          <span>Supporting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: LINK_TYPE_COLORS.shadow }}></div>
          <span>Shadow</span>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-700 p-2 bg-gray-800 text-left sticky left-0 z-10">
              Symbol / Pillar
            </th>
            {data.pillars.map((pillar) => (
              <th
                key={pillar.id}
                className="border border-gray-700 p-2 bg-gray-800 text-sm min-w-[120px]"
              >
                {pillar.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.symbols.map((symbol) => (
            <tr key={symbol.id}>
              <td className="border border-gray-700 p-2 bg-gray-800/50 font-semibold sticky left-0 z-10">
                {symbol.name}
              </td>
              {data.pillars.map((pillar) => {
                const linkType = getLinkType(symbol.id, pillar.id)
                return (
                  <td
                    key={`${symbol.id}-${pillar.id}`}
                    className="border border-gray-700 p-2 text-center"
                    style={{
                      backgroundColor: linkType ? getLinkTypeColor(linkType) + '40' : 'transparent',
                    }}
                  >
                    {linkType && (
                      <span className="text-xs font-semibold uppercase">{linkType}</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-sm text-gray-400 mt-4">
        💡 Matrix shows relationship strength between each symbol and pillar
      </p>
    </div>
  )
}
