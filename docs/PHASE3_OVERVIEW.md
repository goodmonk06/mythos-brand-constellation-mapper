# Phase 3 Overview: Mythos Brand Constellation Mapper

## Purpose Statement

The **Mythos Brand Constellation Mapper** is a data-first platform for mapping the archetypal and mythic dimensions of brand identity. It enables communities, organizations, and content creators to:

1. **Catalog mythic symbols** - animals, elements, objects, figures, and archetypes that resonate with their audience
2. **Define brand pillars** - core values, content themes, and strategic positions
3. **Map constellation relationships** - explicit connections between mythic symbols and brand pillars (core, supporting, shadow)
4. **Visualize the constellation** - network and matrix views of the complete symbolic landscape
5. **Integrate with content systems** - tag actual content pieces with constellation elements
6. **Query for storytelling** - data-first design allows other systems to query for symbols, narratives, and themes

This tool bridges the worlds of brand strategy, storytelling, depth psychology, and content operations. It makes Joseph Campbell, Carl Jung, and Margaret Mark/Carol Pearson's frameworks queryable and actionable for modern digital teams.

## Current Features (Post Phase 2)

✅ **Core Domain Model**
- MythicSymbol (6 categories: animal, element, object, myth_figure, archetype, other)
- BrandPillar (brand values and content pillars)
- ConstellationLink (3 types: core, supporting, shadow)

✅ **Complete Vertical Slice**
- Full CRUD APIs for symbols, pillars, and links
- Constellation query API (graph + matrix formats)
- UI for managing symbols and pillars
- Network visualization (simple SVG graph)
- Matrix visualization (symbol × pillar grid)

✅ **Developer Experience**
- Docker Compose (PostgreSQL + App)
- Prisma ORM with type-safe queries
- Zod validation on all inputs
- Centralized error handling
- Structured logging and metrics
- Health check endpoint
- Rich seed data with 6 symbols, 4 pillars, 12 links

✅ **Testing & Quality**
- Vitest setup
- Integration tests for symbols and constellation
- Validation tests

✅ **Documentation**
- Comprehensive README with API reference
- Setup scripts and Makefile
- .env.example with clear variables

## Current Limitations

⚠️ **Domain Limitations**
- No symbol-to-symbol relationships (e.g., "Phoenix transforms into Fire")
- No content tagging system (can't link actual blog posts, videos, designs to constellation)
- No grouping/themes within a constellation
- No activity logging or audit trail
- No rich metadata on entities (tags, status, versions)

⚠️ **Integration Limitations**
- No LLM adapter for AI-powered symbol suggestions
- No notification/webhook system for constellation changes
- No event system for domain events
- No export/import capabilities
- No external API integrations (CMS, DAM, etc.)

⚠️ **Visualization Limitations**
- Basic SVG visualizations only
- No interactive graph (drag, zoom, filter)
- No force-directed layouts
- No 3D or immersive views

⚠️ **Operational Limitations**
- No CLI tool for maintenance and operations
- Limited seed scenarios (only one demo constellation)
- No test data factories
- No performance optimization (caching, indexes)
- No multi-tenancy controls (communityId exists but not enforced)

## Phase 3 Plan for This Repository

### 1. Domain Deepening (New Entities & Relationships)

**SymbolRelationship**
- Symbols can relate to other symbols
- Relationship types: transforms_into, opposes, complements, contains, emerges_from
- Example: "Phoenix transforms_into Fire", "Fire opposes Water"
- Creates a symbol graph within the constellation

**ContentPiece**
- Actual content tagged with constellation elements
- Types: blog_post, video, image, design, campaign, event
- Links to symbols and pillars via many-to-many
- Metadata: URL, title, description, publish date, status
- Enables "show me all content tagged with Phoenix + Innovation"

**ConstellationTheme**
- Higher-order groupings within a constellation
- Example themes: "Transformation Journey", "Fire Mythology", "Hero's Journey Arc"
- Contains multiple symbols and pillars
- Has its own description and metadata

**ActivityLog**
- Audit trail for all constellation changes
- Tracks: entity type, entity ID, action, actor, timestamp, changes
- Enables history, rollback, analytics

**SymbolMetadata** (enrichment)
- Add tags (array of strings) to symbols
- Add cultural_origin (Greek, Norse, Eastern, etc.)
- Add symbolic_qualities (JSON: courage, transformation, wisdom, etc.)
- Add related_concepts (array of concept names)

**PillarMetadata** (enrichment)
- Add priority (high, medium, low)
- Add color_hex for visual identity
- Add content_guidelines (markdown)

### 2. Additional Vertical Slices

**Slice 1: Symbol Relationships**
- Create/list/update/delete symbol-to-symbol relationships
- Query: "Show me all symbols that transform into Fire"
- Query: "What is the full transformation chain from X to Y?"
- UI: Relationship manager and graph view

**Slice 2: Content Tagging**
- Create/list/update/delete content pieces
- Tag content with multiple symbols and pillars
- Query: "Show me all content for Innovation pillar"
- Query: "Show me content that uses both Phoenix and Fire symbols"
- UI: Content library with constellation filter

**Slice 3: Theme Management**
- Create/list/update/delete constellation themes
- Assign symbols and pillars to themes
- Query: "Show me all themes this symbol belongs to"
- UI: Theme organizer

### 3. Extension Points & Adapters

**ILLMAdapter**
- Interface for AI-powered suggestions
- Methods: suggestSymbolsForPillar, suggestRelationships, generateDescription
- Implementations: OpenAIAdapter, AnthropicAdapter, NoOpAdapter (stub)

**INotificationAdapter**
- Interface for webhooks and notifications
- Methods: onSymbolCreated, onLinkCreated, onConstellationChanged
- Implementations: WebhookAdapter, LogAdapter, NoOpAdapter

**IStorageAdapter**
- Interface for file/image storage (for content pieces)
- Methods: upload, download, delete, getUrl
- Implementations: S3Adapter, LocalAdapter, NoOpAdapter

**Event System**
- Define domain events: SymbolCreatedEvent, LinkCreatedEvent, etc.
- Event emitter/bus pattern
- Event handlers can be registered for extensions
- Enables decoupled integrations

### 4. Enhanced DX

**CLI Tool** (`src/cli/index.ts`)
- Commands:
  - `constellation seed [scenario]` - Seed specific scenarios
  - `constellation export <communityId>` - Export constellation as JSON
  - `constellation import <file>` - Import constellation from JSON
  - `constellation stats <communityId>` - Show constellation statistics
  - `constellation validate` - Validate data integrity

**Additional Scripts**
- `npm run format` - Prettier formatting
- `npm run typecheck` - TypeScript check without build
- `npm run db:studio` - Already exists
- `npm run docker:build` - Build Docker image
- `npm run docker:up` - Start with Docker Compose

### 5. Comprehensive Testing

**Unit Tests**
- Service layer tests for all domain logic
- Validation schema tests
- Adapter interface tests

**Integration Tests**
- API route tests for all endpoints
- Database transaction tests
- Event system tests

**Scenario Tests**
- End-to-end user scenarios
- "Content creator finds symbols for a campaign"
- "Designer explores constellation for visual identity"

**Test Factories**
- `createTestSymbol()`, `createTestPillar()`, etc.
- Randomized but realistic test data
- Reusable across all tests

### 6. Rich Seed Data

**Multiple Scenarios**
- Scenario 1: "Tech Startup" (innovation, disruption themes)
- Scenario 2: "Wellness Brand" (healing, nature themes)
- Scenario 3: "Education Platform" (wisdom, growth themes)
- Scenario 4: "Social Movement" (justice, transformation themes)

Each scenario includes:
- 8-12 symbols across categories
- 4-6 brand pillars
- 15-25 constellation links
- 3-5 symbol relationships
- 5-10 content pieces
- 2-4 themes

### 7. Enhanced Documentation

**docs/ARCHITECTURE.md**
- System architecture diagram (in text)
- Layer breakdown: API → Service → Domain → Data
- Extension points and integration patterns

**docs/DOMAIN_MODEL.md**
- Entity-relationship diagram (in text)
- Detailed field descriptions
- Business rules and constraints
- Example queries and use cases

**docs/INTEGRATION_RECIPES.md**
- How to integrate with CMS (Contentful, Sanity)
- How to integrate with AI (OpenAI, Anthropic)
- How to send constellation data to design tools (Figma)
- How to use constellation for content planning

**docs/USE_CASES.md**
- Detailed user stories and flows
- Personas: content strategist, designer, marketer, developer
- Screenshots (described in text)

**CHANGELOG.md**
- Version history
- Breaking changes
- Migration guides

## Success Metrics

After Phase 3, this repository should demonstrate:

1. **Richness**: 10x+ codebase size with meaningful features
2. **Reusability**: Clear extension points for integration with larger ecosystem
3. **Production-readiness**: Robust error handling, logging, testing, docs
4. **Data-first**: Easy to query constellation data programmatically
5. **Community value**: Obvious utility for content, design, and strategy teams

## Timeline

Phase 3 will be implemented incrementally:
- Domain expansion: New models and migrations
- Vertical slices: One at a time, fully implemented
- Extension points: Interfaces and stub implementations
- Documentation: As features are built
- Testing: Parallel with feature development

The goal is a production-ready, deeply useful building block in the larger AI-driven community ecosystem.
