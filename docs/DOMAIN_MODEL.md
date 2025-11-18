# Domain Model

## Overview

The constellation mapper domain model represents the archetypal and mythic dimensions of brand identity through interconnected entities. The core concept is mapping **symbols** (archetypal, mythic elements) to **brand pillars** (core values) via **constellation links**.

## Entity-Relationship Diagram (Text Format)

```
                    ┌─────────────────┐
                    │  MythicSymbol   │
                    ├─────────────────┤
                    │ id              │
                    │ communityId     │
                    │ key             │
                    │ name            │
                    │ description     │
                    │ category        │◄─────┐
                    │ tags[]          │      │
                    │ culturalOrigin  │      │
                    │ qualities{}     │      │
                    └────────┬────────┘      │
                             │               │
              ┌──────────────┼───────────┐   │
              │              │           │   │
              ▼              ▼           ▼   │
    ┌──────────────┐  ┌─────────────┐  ┌──────────────────┐
    │Constellation │  │   Symbol    │  │   ContentPiece   │
    │     Link     │  │Relationship │  │     Symbol       │
    ├──────────────┤  ├─────────────┤  ├──────────────────┤
    │ symbolId     │  │ fromSymbolId├──┘  │ contentPieceId   │
    │ pillarId     │  │ toSymbolId  │     │ symbolId         │
    │ linkType     │  │ relationType│     └──────────────────┘
    │ notes        │  │ notes       │
    └──────┬───────┘  └─────────────┘
           │
           │
           ▼
    ┌─────────────────┐
    │   BrandPillar   │
    ├─────────────────┤
    │ id              │
    │ communityId     │
    │ key             │
    │ name            │◄─────┐
    │ description     │      │
    │ priority        │      │
    │ colorHex        │      │
    │ guidelines      │      │
    └─────────────────┘      │
                             │
                    ┌────────┴────────┐
                    │  ContentPiece   │
                    │    Pillar       │
                    ├─────────────────┤
                    │ contentPieceId  │
                    │ pillarId        │
                    └─────────────────┘


    ┌──────────────────────┐
    │ ConstellationTheme   │◄────┐
    ├──────────────────────┤     │
    │ id                   │     │
    │ communityId          │     │
    │ key                  │     │
    │ name                 │     │
    │ description          │     │
    │ colorHex             │     │
    └──────────────────────┘     │
              │                  │
              │                  │
        ┌─────┴──────┐           │
        ▼            ▼           │
  ┌──────────┐  ┌──────────┐    │
  │  Theme   │  │  Theme   │    │
  │  Symbol  │  │  Pillar  │    │
  ├──────────┤  ├──────────┤    │
  │ themeId  ├──┘  │ themeId  │    │
  │ symbolId │     │ pillarId │    │
  └──────────┘     └──────────┘    │
                                   │
                                   │
    ┌──────────────────────┐       │
    │    ContentPiece      │       │
    ├──────────────────────┤       │
    │ id                   │       │
    │ communityId          │       │
    │ title                │       │
    │ description          │       │
    │ contentType          │       │
    │ url                  │       │
    │ status               │       │
    │ publishedAt          │       │
    │ metadata{}           │       │
    └──────────────────────┘       │
              │                    │
              └────────────────────┘
```

## Core Entities

### MythicSymbol

**Purpose**: Archetypal symbols that carry cultural and psychological meaning.

**Fields**:
- `id` - Unique identifier (cuid)
- `communityId` - Multi-tenancy identifier
- `key` - URL-friendly slug (e.g., "phoenix", "fire-element")
- `name` - Display name
- `descriptionMarkdown` - Rich text description
- `category` - Enum: animal | element | object | myth_figure | archetype | other
- `tags` - Array of string tags for searchability
- `culturalOrigin` - Cultural source (e.g., "Greek", "Norse", "Eastern", "Universal")
- `symbolicQualities` - JSON object of boolean qualities (e.g., `{courage: true, transformation: true}`)
- `relatedConcepts` - Array of related concept names
- `createdAt`, `updatedAt` - Timestamps

**Relations**:
- One-to-many → ConstellationLink
- One-to-many → ContentPieceSymbol
- One-to-many → ThemeSymbol
- One-to-many → SymbolRelationship (as source)
- One-to-many → SymbolRelationship (as target)

**Business Rules**:
- `(communityId, key)` must be unique
- `category` must be one of the defined enums
- `key` must match pattern: `^[a-z0-9-]+$`

**Examples**:
```json
{
  "key": "phoenix",
  "name": "Phoenix",
  "category": "animal",
  "tags": ["transformation", "rebirth", "resilience"],
  "culturalOrigin": "Greek",
  "symbolicQualities": {
    "transformation": true,
    "resilience": true,
    "renewal": true
  }
}
```

### BrandPillar

**Purpose**: Core brand values, content pillars, or strategic themes.

**Fields**:
- `id` - Unique identifier
- `communityId` - Multi-tenancy identifier
- `key` - URL-friendly slug
- `name` - Display name
- `descriptionMarkdown` - Rich text description
- `priority` - Enum: high | medium | low
- `colorHex` - Brand color for visual identity (e.g., "#FF6B35")
- `contentGuidelines` - Markdown guidelines for content creation
- `createdAt`, `updatedAt` - Timestamps

**Relations**:
- One-to-many → ConstellationLink
- One-to-many → ContentPiecePillar
- One-to-many → ThemePillar

**Business Rules**:
- `(communityId, key)` must be unique
- `colorHex` must match pattern: `^#[0-9A-Fa-f]{6}$`

**Examples**:
```json
{
  "key": "innovation",
  "name": "Innovation & Creativity",
  "priority": "high",
  "colorHex": "#FF6B35",
  "contentGuidelines": "Focus on: breakthrough thinking, novel solutions..."
}
```

### ConstellationLink

**Purpose**: Maps relationships between symbols and pillars, forming the constellation.

**Fields**:
- `id` - Unique identifier
- `symbolId` - Reference to MythicSymbol
- `pillarId` - Reference to BrandPillar
- `linkType` - Enum: core | supporting | shadow
- `notesMarkdown` - Explanation of the connection
- `createdAt`, `updatedAt` - Timestamps

**Relations**:
- Many-to-one → MythicSymbol
- Many-to-one → BrandPillar

**Business Rules**:
- `(symbolId, pillarId)` must be unique (one link per symbol-pillar pair)
- Both symbolId and pillarId must exist

**Link Types Explained**:
- **core**: Central, defining relationship - this symbol is fundamental to this pillar
- **supporting**: Reinforcing relationship - this symbol strengthens this pillar
- **shadow**: Contrasting or cautionary - represents what to avoid or transcend

**Examples**:
```json
{
  "symbolId": "phoenix-id",
  "pillarId": "transformation-id",
  "linkType": "core",
  "notesMarkdown": "Phoenix is the ultimate symbol of transformation and rebirth."
}
```

## Extended Entities (Phase 3)

### SymbolRelationship

**Purpose**: Captures relationships between symbols, creating a symbol graph.

**Fields**:
- `id` - Unique identifier
- `fromSymbolId` - Source symbol
- `toSymbolId` - Target symbol
- `relationshipType` - Enum: transforms_into | opposes | complements | contains | emerges_from
- `notesMarkdown` - Explanation
- `createdAt`, `updatedAt` - Timestamps

**Relations**:
- Many-to-one → MythicSymbol (from)
- Many-to-one → MythicSymbol (to)

**Relationship Types**:
- **transforms_into**: Symbol A becomes Symbol B (Phoenix → Fire)
- **opposes**: Symbols are in tension (Fire ↔ Water)
- **complements**: Symbols enhance each other (Sun ↔ Moon)
- **contains**: Symbol A holds Symbol B (Ocean ⊃ Fish)
- **emerges_from**: Symbol A arises from Symbol B (Phoenix ← Ashes)

**Use Cases**:
- "Show me the transformation chain from X to Y"
- "What symbols oppose Fire?"
- "Map the complete Phoenix mythology"

### ContentPiece

**Purpose**: Actual content (blog posts, videos, designs) tagged with constellation elements.

**Fields**:
- `id` - Unique identifier
- `communityId` - Multi-tenancy identifier
- `title` - Content title
- `descriptionMarkdown` - Content description
- `contentType` - Enum: blog_post | video | image | design | campaign | event | social_post | other
- `url` - Optional URL to content
- `status` - Enum: draft | published | archived
- `publishedAt` - Optional publish timestamp
- `metadata` - JSON for flexible additional data
- `createdAt`, `updatedAt` - Timestamps

**Relations**:
- Many-to-many → MythicSymbol (via ContentPieceSymbol)
- Many-to-many → BrandPillar (via ContentPiecePillar)

**Use Cases**:
- "Show me all blog posts tagged with Phoenix and Innovation"
- "Find video content for the Transformation pillar"
- "What symbols are most used in our published content?"

### ConstellationTheme

**Purpose**: Higher-order groupings of related symbols and pillars.

**Fields**:
- `id` - Unique identifier
- `communityId` - Multi-tenancy identifier
- `key` - URL-friendly slug
- `name` - Theme name
- `descriptionMarkdown` - Theme description
- `colorHex` - Optional theme color
- `createdAt`, `updatedAt` - Timestamps

**Relations**:
- Many-to-many → MythicSymbol (via ThemeSymbol)
- Many-to-many → BrandPillar (via ThemePillar)

**Examples**:
- "Fire & Transformation" theme (Phoenix, Fire, Prometheus → Transformation, Innovation)
- "Hero's Journey" theme (Mountain, Warrior, Sword → Growth, Challenge, Mastery)

**Use Cases**:
- Organize constellations into narrative arcs
- Create content campaigns around themes
- Bundle related symbols for design systems

### ActivityLog

**Purpose**: Complete audit trail of all constellation changes.

**Fields**:
- `id` - Unique identifier
- `communityId` - Community identifier
- `entityType` - Type of entity (e.g., "MythicSymbol", "BrandPillar")
- `entityId` - ID of the affected entity
- `action` - Enum: created | updated | deleted | linked | unlinked
- `actorId` - Optional user ID (future)
- `actorName` - Optional actor name/identifier
- `changes` - JSON of what changed
- `metadata` - Additional context
- `createdAt` - Timestamp

**Use Cases**:
- "Who created this symbol?"
- "What changed in the last week?"
- "Show me all deletions"
- "Rollback to previous state"
- Analytics and insights

## Join Tables (Many-to-Many)

### ContentPieceSymbol
Links ContentPiece ↔ MythicSymbol

### ContentPiecePillar
Links ContentPiece ↔ BrandPillar

### ThemeSymbol
Links ConstellationTheme ↔ MythicSymbol

### ThemePillar
Links ConstellationTheme ↔ BrandPillar

## Enums

### SymbolCategory
```
animal       - Animals (Phoenix, Dragon, Owl, etc.)
element      - Elements (Fire, Water, Earth, Air)
object       - Objects (Sword, Mountain, Torch, etc.)
myth_figure  - Mythological figures (Prometheus, Athena, Hermes)
archetype    - Jungian archetypes (Hero, Sage, Creator, etc.)
other        - Catch-all category
```

### LinkType
```
core       - Central, defining relationship
supporting - Reinforcing relationship
shadow     - Contrasting or cautionary relationship
```

### SymbolRelationType
```
transforms_into - A becomes B
opposes         - A and B are in tension
complements     - A and B enhance each other
contains        - A holds/includes B
emerges_from    - A arises from B
```

### PillarPriority
```
high   - Most important brand pillars
medium - Secondary pillars
low    - Supporting pillars
```

### ContentType
```
blog_post   - Blog articles
video       - Video content
image       - Images and graphics
design      - Design assets
campaign    - Marketing campaigns
event       - Events and experiences
social_post - Social media posts
other       - Other content types
```

### ContentStatus
```
draft     - Work in progress
published - Live content
archived  - No longer active
```

### LogAction
```
created  - Entity was created
updated  - Entity was modified
deleted  - Entity was removed
linked   - Relationship was created
unlinked - Relationship was removed
```

## Query Patterns

### Find symbols for a pillar
```typescript
const pillar = await prisma.brandPillar.findUnique({
  where: { id: pillarId },
  include: {
    constellationLinks: {
      include: { symbol: true }
    }
  }
})
const symbols = pillar.constellationLinks.map(link => link.symbol)
```

### Find content using specific symbol and pillar
```typescript
const content = await prisma.contentPiece.findMany({
  where: {
    symbols: { some: { symbolId: symbolId } },
    pillars: { some: { pillarId: pillarId } }
  }
})
```

### Get full constellation for community
```typescript
const [symbols, pillars, links] = await Promise.all([
  prisma.mythicSymbol.findMany({ where: { communityId } }),
  prisma.brandPillar.findMany({ where: { communityId } }),
  prisma.constellationLink.findMany({
    where: { symbol: { communityId } },
    include: { symbol: true, pillar: true }
  })
])
```

### Trace symbol transformation chain
```typescript
async function getTransformationChain(symbolId: string) {
  const relationships = await prisma.symbolRelationship.findMany({
    where: {
      fromSymbolId: symbolId,
      relationshipType: 'transforms_into'
    },
    include: { toSymbol: true }
  })
  // Recursively follow chain
}
```

## Indexes

Performance-critical indexes:
- `MythicSymbol`: (communityId), (category), (tags)
- `BrandPillar`: (communityId), (priority)
- `ConstellationLink`: (symbolId), (pillarId), (linkType)
- `SymbolRelationship`: (fromSymbolId), (toSymbolId), (relationshipType)
- `ContentPiece`: (communityId), (contentType), (status), (publishedAt)
- `ActivityLog`: (communityId), (entityType, entityId), (action), (createdAt)

---

**Last Updated**: Phase 3 (Post deep expansion)
