# Architecture

## System Overview

The Mythos Brand Constellation Mapper is built as a Next.js fullstack application with a data-first architecture that prioritizes queryability and integration with external systems.

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Symbols    │  │   Pillars    │  │ Constellation│  │
│  │     UI       │  │     UI       │  │     View     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      API Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   REST APIs  │  │  Validation  │  │    Error     │  │
│  │   (Next.js)  │  │    (Zod)     │  │   Handling   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Domain      │  │   Events     │  │   Adapters   │  │
│  │   Logic      │  │   System     │  │   (LLM/etc)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Prisma     │  │  PostgreSQL  │  │   Activity   │  │
│  │     ORM      │  │   Database   │  │     Logs     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Layer Breakdown

### Client Layer (Next.js React)

**Purpose**: User interface for managing constellations

**Key Components**:
- `src/app/page.tsx` - Home page and navigation
- `src/app/symbols/` - Symbol management UI
- `src/app/pillars/` - Pillar management UI
- `src/app/constellation/` - Visualization views (network + matrix)
- `src/app/globals.css` - Styling and theme

**Technology**: Next.js App Router, React Server Components, Tailwind CSS

### API Layer (Next.js Route Handlers)

**Purpose**: RESTful API for all constellation operations

**Endpoints**:
```
/api/symbols          - MythicSymbol CRUD
/api/pillars          - BrandPillar CRUD
/api/links            - ConstellationLink CRUD
/api/symbol-relationships - SymbolRelationship CRUD
/api/content          - ContentPiece CRUD
/api/themes           - ConstellationTheme CRUD
/api/constellation    - Full constellation query (graph + matrix)
/api/health           - Health check
```

**Key Features**:
- Input validation (Zod schemas)
- Centralized error handling
- Structured logging
- Metrics collection
- Activity logging

**Files**:
- `src/app/api/**/route.ts` - API route handlers
- `src/lib/validations.ts` - Zod validation schemas
- `src/lib/errors.ts` - Error handling utilities
- `src/lib/logger.ts` - Structured logging
- `src/lib/metrics.ts` - Metrics collection

### Service Layer

**Purpose**: Business logic, domain operations, and integrations

**Components**:

1. **Event System** (`src/lib/events.ts`)
   - Domain event emitter
   - Type-safe event handling
   - Decoupled extension points

2. **Adapter Interfaces** (`src/lib/adapters/`)
   - `llm.ts` - LLM integration (OpenAI, Anthropic)
   - `notification.ts` - Webhooks and notifications
   - `storage.ts` - File/image storage (S3, local)

**Patterns**:
- Factory pattern for adapter creation
- Interface-based design for testability
- Stub implementations for development

### Data Layer (Prisma + PostgreSQL)

**Purpose**: Persistent data storage and querying

**Schema** (`prisma/schema.prisma`):
- **MythicSymbol** - Archetypal symbols with metadata
- **BrandPillar** - Brand values and content pillars
- **ConstellationLink** - Symbol↔Pillar relationships
- **SymbolRelationship** - Symbol↔Symbol relationships
- **ContentPiece** - Actual content tagged with constellation
- **ConstellationTheme** - Higher-order groupings
- **ActivityLog** - Audit trail

**Key Features**:
- Type-safe queries with Prisma Client
- Cascade deletes for referential integrity
- Indexes for performance
- Rich metadata (JSON fields, arrays)

## Extension Points

### 1. Event System

Register handlers for domain events:

```typescript
import { events } from '@/lib/events'

events.on('symbol.created', async (event) => {
  console.log('New symbol:', event.data.name)
  // Trigger webhooks, update cache, send notifications, etc.
})
```

### 2. LLM Adapter

Plug in AI-powered suggestions:

```typescript
import { createLLMAdapter } from '@/lib/adapters/llm'

const llm = createLLMAdapter()
const suggestions = await llm.suggestSymbolsForPillar(
  'Innovation',
  'We push boundaries...'
)
```

### 3. Notification Adapter

Send constellation change notifications:

```typescript
import { createNotificationAdapter } from '@/lib/adapters/notification'

const notifier = createNotificationAdapter()
await notifier.notify({
  type: 'symbol.created',
  communityId: 'demo',
  entityId: symbolId,
  data: symbolData,
  timestamp: new Date()
})
```

### 4. Storage Adapter

Store and retrieve files:

```typescript
import { createStorageAdapter } from '@/lib/adapters/storage'

const storage = createStorageAdapter()
const file = await storage.upload('key', buffer, 'image/png')
const url = await storage.getUrl(file.key)
```

## Data Flow

### Example: Creating a Symbol

1. **Client** → POST `/api/symbols` with symbol data
2. **API Layer** → Validate with Zod schema
3. **Service Layer** →
   - Create symbol in database (Prisma)
   - Log activity
   - Emit `symbol.created` event
   - Trigger notifications (if configured)
4. **Data Layer** → Persist to PostgreSQL
5. **Response** → Return created symbol to client

### Example: Querying Constellation

1. **Client** → GET `/api/constellation?communityId=demo`
2. **API Layer** → Fetch symbols, pillars, links in parallel
3. **Service Layer** →
   - Transform data into graph format
   - Transform data into matrix format
   - Calculate statistics
4. **Response** → Return comprehensive constellation data

## Security Considerations

**Current State** (Phase 3):
- Input validation on all endpoints
- SQL injection protection (Prisma parameterized queries)
- Type safety (TypeScript + Zod)

**Future Enhancements**:
- Authentication (JWT, OAuth)
- Authorization (RBAC, community-level permissions)
- Rate limiting
- API key management

## Performance Optimizations

**Current**:
- Database indexes on frequently queried fields
- Parallel queries where possible
- Efficient Prisma includes

**Future**:
- Redis caching layer
- CDN for static assets
- Database query optimization
- Pagination for large result sets
- GraphQL layer for flexible querying

## Deployment

**Docker**:
- `Dockerfile` - Multi-stage build for Next.js app
- `docker-compose.yml` - PostgreSQL + App services
- Health checks for both services

**Environment Variables** (`.env`):
```
DATABASE_URL              - PostgreSQL connection string
OPENAI_API_KEY           - Optional LLM integration
WEBHOOK_URL              - Optional webhook notifications
S3_BUCKET                - Optional S3 storage
NODE_ENV                 - production/development
```

## Monitoring & Observability

**Logging**:
- Structured JSON logs in production
- Colorized console logs in development
- Contextual logging with metadata

**Metrics**:
- Counter metrics for API calls
- Gauge metrics for resource usage
- Histogram metrics for latencies

**Activity Logs**:
- Complete audit trail in database
- Track all creates, updates, deletes
- Queryable for analytics

## Testing Strategy

**Unit Tests** (`src/**/__tests__/`):
- Validation schema tests
- Domain logic tests
- Adapter interface tests

**Integration Tests** (`src/app/api/__tests__/`):
- API endpoint tests
- Database transaction tests
- Full vertical slice tests

**Scenario Tests**:
- End-to-end user workflows
- Multi-entity operations

## CLI Tool

**Purpose**: Maintenance, seeding, operations

**Commands** (`npm run cli`):
- `seed [scenario]` - Seed database with scenarios
- `export <communityId>` - Export constellation as JSON
- `stats <communityId>` - Show statistics
- `validate` - Check data integrity
- `clean <communityId>` - Remove all data

## Future Architecture Enhancements

1. **GraphQL API** - Flexible querying layer
2. **Real-time Updates** - WebSocket/SSE for live collaboration
3. **Multi-tenancy** - Full isolation between communities
4. **Analytics Pipeline** - Data warehouse for insights
5. **Plugin System** - Dynamic extension loading
6. **Microservices** - Extract heavy operations (LLM, visualization rendering)

## Code Organization

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers
│   ├── symbols/           # Symbol UI pages
│   ├── pillars/           # Pillar UI pages
│   ├── constellation/     # Visualization pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Shared libraries
│   ├── adapters/          # Extension adapters
│   ├── db.ts              # Prisma client
│   ├── validations.ts     # Zod schemas
│   ├── errors.ts          # Error handling
│   ├── logger.ts          # Logging
│   ├── metrics.ts         # Metrics
│   └── events.ts          # Event system
├── cli/                   # CLI tool
│   ├── index.ts           # CLI entrypoint
│   └── seed-scenarios.ts  # Seed data
└── __tests__/             # Test files

prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Original seed script

docs/
├── PHASE3_OVERVIEW.md     # Phase 3 plan
├── ARCHITECTURE.md        # This file
├── DOMAIN_MODEL.md        # Entity descriptions
└── INTEGRATION_RECIPES.md # Integration guides
```

---

**Last Updated**: Phase 3 (Post deep expansion)
