# 🌌 Mythos Brand Constellation Mapper

> Map your community's myths, symbols, and brand pillars as interconnected constellations

A Next.js fullstack application for mapping the mythic dimensions of your brand. Connect archetypal symbols, stories, and motifs to your brand's core values and content pillars, creating a rich constellation of meaning that guides storytelling, design, and content strategy.

コミュニティの神話・物語・シンボル群を「星座」としてマッピングするミソス／ブランド・コンステレーションマッパー。

## 🎯 What is a Brand Constellation?

A **brand constellation** is a network of mythic symbols, archetypes, and narratives that resonate with your community, mapped to your brand's core pillars. It creates a shared language of meaning that can:

- **Guide content creation** - Know which stories, metaphors, and symbols align with each brand pillar
- **Inform design decisions** - Use visual elements that carry mythic resonance
- **Strengthen storytelling** - Weave consistent symbolic threads through all communications
- **Build community** - Create shared cultural touchstones that deepen connection
- **Differentiate your brand** - Own a unique symbolic territory in your space

### Example Use Cases

1. **Content Strategy**: "We're writing about innovation this month—what mythic symbols map to our Innovation pillar? Phoenix, Fire, Prometheus... let's explore transformation narratives."

2. **Design System**: "Our Authenticity pillar connects to the Sword and Truth symbols—we should use sharp, clear visual language and metallic accents."

3. **Campaign Planning**: "The Sacred Mountain symbol links to both Community and Transformation—perfect for our Q1 'Summit Together' campaign."

4. **Onboarding**: "Here's our brand constellation—it shows how we think about our values through archetypal stories and symbols."

## ✨ Features

- **📊 Data-First Architecture** - Designed to be queried from other services and tools
- **🌟 Mythic Symbol Library** - Manage symbols across categories: animals, elements, objects, figures, archetypes
- **🏛️ Brand Pillar Management** - Define your core brand values and content pillars
- **🔗 Constellation Links** - Map relationships as core, supporting, or shadow connections
- **📈 Network Visualization** - See your constellation as an interconnected graph
- **🎯 Matrix View** - Understand symbol-pillar relationships at a glance
- **🗄️ PostgreSQL + Prisma** - Robust, type-safe data layer
- **🐳 Docker Support** - One-command local development setup
- **🌱 Seeded Examples** - Start with a pre-built constellation to explore

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Make (optional, for convenience commands)

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd mythos-brand-constellation-mapper

# Run the setup script (recommended)
./scripts/setup.sh

# OR do it manually:
npm install
cp .env.example .env
docker-compose up -d
npm run db:push
npm run db:seed
```

### Development

```bash
# Start development server
npm run dev

# Or using Make
make dev

# Visit http://localhost:3000
```

### Other Commands

```bash
# Database management
npm run db:studio      # Open Prisma Studio
npm run db:migrate     # Create a migration
npm run db:push        # Push schema changes (dev)
npm run db:seed        # Seed example data

# Testing
npm test               # Run tests
npm run test:ui        # Run tests with UI

# Utility scripts
./scripts/reset-db.sh  # Reset and reseed database
```

## 📁 Project Structure

```
mythos-brand-constellation-mapper/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   ├── symbols/      # Symbol CRUD
│   │   │   ├── pillars/      # Pillar CRUD
│   │   │   ├── links/        # Link CRUD
│   │   │   └── constellation/ # Full constellation data
│   │   ├── symbols/          # Symbol management UI
│   │   ├── pillars/          # Pillar management UI
│   │   ├── constellation/    # Visualization views
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       ├── db.ts             # Prisma client
│       ├── validations.ts    # Zod schemas
│       └── __tests__/        # Unit tests
├── scripts/
│   ├── setup.sh              # Initial setup
│   └── reset-db.sh           # Database reset
├── docker-compose.yml         # PostgreSQL service
├── Makefile                   # Convenience commands
└── README.md
```

## 🗄️ Data Model

### MythicSymbol

Archetypal symbols that carry cultural and psychological meaning.

```typescript
{
  id: string              // Unique identifier
  communityId: string     // Multi-tenancy support
  key: string             // URL-friendly key (e.g., "phoenix")
  name: string            // Display name
  descriptionMarkdown: string  // Rich description
  category: SymbolCategory     // animal | element | object | myth_figure | archetype | other
  createdAt: DateTime
  updatedAt: DateTime
}
```

### BrandPillar

Core brand values, content pillars, or strategic themes.

```typescript
{
  id: string              // Unique identifier
  communityId: string     // Multi-tenancy support
  key: string             // URL-friendly key (e.g., "innovation")
  name: string            // Display name
  descriptionMarkdown: string  // Rich description
  createdAt: DateTime
  updatedAt: DateTime
}
```

### ConstellationLink

Connections between symbols and pillars forming the constellation.

```typescript
{
  id: string              // Unique identifier
  symbolId: string        // Reference to MythicSymbol
  pillarId: string        // Reference to BrandPillar
  linkType: LinkType      // core | supporting | shadow
  notesMarkdown: string   // Explanation of the connection
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Link Types:**
- `core`: Central, defining relationship - this symbol is fundamental to this pillar
- `supporting`: Reinforcing relationship - this symbol strengthens this pillar
- `shadow`: Contrasting or cautionary relationship - represents what to avoid or transcend

## 🌐 API Reference

### Symbols

- `GET /api/symbols?communityId=X&category=Y` - List symbols
- `POST /api/symbols` - Create symbol
- `GET /api/symbols/[id]` - Get symbol with links
- `PATCH /api/symbols/[id]` - Update symbol
- `DELETE /api/symbols/[id]` - Delete symbol

### Pillars

- `GET /api/pillars?communityId=X` - List pillars
- `POST /api/pillars` - Create pillar
- `GET /api/pillars/[id]` - Get pillar with links
- `PATCH /api/pillars/[id]` - Update pillar
- `DELETE /api/pillars/[id]` - Delete pillar

### Links

- `GET /api/links?symbolId=X&pillarId=Y` - List links
- `POST /api/links` - Create link
- `GET /api/links/[id]` - Get link
- `PATCH /api/links/[id]` - Update link
- `DELETE /api/links/[id]` - Delete link

### Constellation

- `GET /api/constellation?communityId=X` - Get complete constellation data (graph + matrix format)

Returns:
```json
{
  "constellation": {
    "communityId": "demo",
    "graph": {
      "nodes": [...],  // Symbols and pillars as nodes
      "edges": [...]   // Links as edges
    },
    "matrix": {
      "symbols": [...],
      "pillars": [...],
      "cells": [...]   // Symbol-pillar intersections
    },
    "stats": {
      "symbolCount": 6,
      "pillarCount": 4,
      "linkCount": 12
    }
  }
}
```

## 🎨 Using Your Constellation

### 1. Content Creation

Query the constellation to find symbols that align with your content pillar:

```typescript
// Find all symbols connected to "Innovation" pillar
const symbols = await fetch('/api/pillars/innovation-id')
  .then(r => r.json())
  .then(data => data.pillar.constellationLinks.map(link => link.symbol))

// Now use these symbols in your content
// Phoenix → Transformation narratives
// Prometheus → "Bringing fire to the people" metaphors
```

### 2. Design Systems

Use symbol categories to inform visual language:

```typescript
// Get all "element" symbols for a pillar
const elementSymbols = symbols.filter(s => s.category === 'element')

// Fire → Red/orange palette, dynamic shapes, upward motion
// Water → Blue palette, fluid shapes, calming animation
```

### 3. Campaign Planning

Identify symbols that bridge multiple pillars:

```typescript
// Find symbols with multiple core connections
const centralSymbols = symbols.filter(s =>
  s.constellationLinks.filter(l => l.linkType === 'core').length >= 2
)

// These are your "power symbols" - use them for cross-pillar campaigns
```

### 4. Team Alignment

Use the constellation as an onboarding tool:

- Show new team members the visualization
- Explain how each symbol connects to brand values
- Create a shared vocabulary for discussing brand decisions

## 🔮 Future Enhancements

- [ ] **LLM Integration** - AI-powered symbol suggestions and relationship discovery
- [ ] **Advanced Visualizations** - 3D constellation view, force-directed graphs
- [ ] **Symbol Taxonomy** - Hierarchical symbol organization
- [ ] **Story Templates** - Pre-built narrative structures using your symbols
- [ ] **Content Tagging** - Tag actual content pieces with constellation elements
- [ ] **Multi-Community** - Full multi-tenancy support
- [ ] **Export/Import** - Share constellations between projects
- [ ] **API Integrations** - Connect to CMS, DAM, and other tools

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui
```

## 📚 Conceptual Background

This tool draws on:

- **Jungian Archetypes** - Universal symbols in the collective unconscious
- **Joseph Campbell's Hero's Journey** - Mythic narrative structures
- **Brand Archetypes** - Margaret Mark & Carol Pearson's framework
- **Semiotics** - The study of signs and symbols in culture
- **Constellation Theory** - Systemic relationships and emergent patterns

The goal is to make these powerful frameworks practical and queryable for modern brand work.

## 🤝 Contributing

Contributions welcome! This is a tool for the community, by the community.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🌟 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Zod](https://zod.dev/) - Validation

---

**Made with ✨ for communities who believe in the power of story**
