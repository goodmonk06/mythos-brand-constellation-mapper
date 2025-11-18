# Integration Recipes

This document provides practical examples for integrating the Mythos Brand Constellation Mapper with common systems and workflows.

## Table of Contents

1. [CMS Integration (Contentful, Sanity)](#cms-integration)
2. [AI/LLM Integration (OpenAI, Anthropic)](#aillm-integration)
3. [Design Tools (Figma, Adobe)](#design-tools-integration)
4. [Analytics & BI Tools](#analytics-integration)
5. [Webhook & Event Integration](#webhook-integration)
6. [API Client Libraries](#api-client-libraries)

---

## CMS Integration

### Contentful

**Use Case**: Tag Contentful content entries with constellation symbols and pillars.

**Approach 1: Custom Field Extension**

Create a Contentful field extension that queries constellation API:

```javascript
// contentful-constellation-extension.js
const CONSTELLATION_API = 'https://your-constellation-api.com'

async function fetchSymbols(communityId) {
  const response = await fetch(
    `${CONSTELLATION_API}/api/symbols?communityId=${communityId}`
  )
  const { symbols } = await response.json()
  return symbols
}

// Render multi-select dropdown of symbols
```

**Approach 2: Webhook Sync**

Sync published Contentful entries to constellation:

```javascript
// Contentful webhook handler
app.post('/webhooks/contentful', async (req, res) => {
  const { sys, fields } = req.body

  if (sys.type === 'Entry' && sys.contentType.sys.id === 'blogPost') {
    // Create content piece in constellation
    await fetch(`${CONSTELLATION_API}/api/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        communityId: 'your-community',
        title: fields.title['en-US'],
        descriptionMarkdown: fields.summary['en-US'],
        contentType: 'blog_post',
        url: `https://yourblog.com/${sys.id}`,
        status: 'published',
        publishedAt: sys.publishedAt,
        symbolIds: fields.symbols?.['en-US'] || [],
        pillarIds: fields.pillars?.['en-US'] || [],
      }),
    })
  }

  res.status(200).send('OK')
})
```

### Sanity

**Use Case**: Add constellation references to Sanity schemas.

```javascript
// schemas/blogPost.js
export default {
  name: 'blogPost',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'symbols',
      title: 'Mythic Symbols',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'mythicSymbol' }],
        },
      ],
      description: 'Which symbols does this content evoke?',
    },
    {
      name: 'pillars',
      title: 'Brand Pillars',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'brandPillar' }],
        },
      ],
      description: 'Which brand pillars does this support?',
    },
  ],
}
```

Sync Sanity data with constellation API via GROQ queries and webhooks.

---

## AI/LLM Integration

### OpenAI Integration

**Use Case**: Get AI-powered symbol suggestions.

```typescript
// lib/adapters/llm.ts (full implementation)
import OpenAI from 'openai'

export class OpenAIAdapter implements LLMAdapter {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async suggestSymbolsForPillar(
    pillarName: string,
    pillarDescription: string,
    existingSymbols: { name: string; category: string }[] = []
  ): Promise<SymbolSuggestion[]> {
    const existing = existingSymbols.map(s => s.name).join(', ')

    const prompt = `You are an expert in mythology, archetypes, and brand strategy.

Brand Pillar: ${pillarName}
Description: ${pillarDescription}
Existing Symbols: ${existing || 'none'}

Suggest 5 mythic symbols or archetypes that would align with this brand pillar.
For each, provide:
- name
- category (animal, element, object, myth_figure, archetype, other)
- description (2-3 sentences)
- tags (3-5 relevant tags)
- culturalOrigin (Greek, Norse, Eastern, Universal, etc.)
- confidence (0-1)

Return as JSON array.`

    const response = await this.client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) return []

    const { suggestions } = JSON.parse(content)
    return suggestions
  }

  async generateDescription(
    type: 'symbol' | 'pillar',
    name: string,
    context?: string
  ): Promise<string> {
    const prompt =
      type === 'symbol'
        ? `Write a 2-3 sentence description of the mythic symbol "${name}". ${context || ''}`
        : `Write a 2-3 sentence brand pillar description for "${name}". ${context || ''}`

    const response = await this.client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
    })

    return response.choices[0]?.message?.content || ''
  }
}
```

**Usage**:
```typescript
import { OpenAIAdapter } from '@/lib/adapters/llm'

const llm = new OpenAIAdapter(process.env.OPENAI_API_KEY!)

const suggestions = await llm.suggestSymbolsForPillar(
  'Innovation',
  'We push boundaries and create the future'
)

suggestions.forEach(s => {
  console.log(`${s.name} (${s.category}) - ${s.confidence}`)
})
```

### Anthropic Claude Integration

Similar pattern using Anthropic SDK:

```typescript
import Anthropic from '@anthropic-ai/sdk'

export class AnthropicAdapter implements LLMAdapter {
  private client: Anthropic

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey })
  }

  async suggestSymbolsForPillar(/* ... */): Promise<SymbolSuggestion[]> {
    const message = await this.client.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    // Parse and return suggestions
  }
}
```

---

## Design Tools Integration

### Figma Plugin

**Use Case**: Access constellation data directly in Figma for design decisions.

```typescript
// figma-plugin/code.ts
const CONSTELLATION_API = 'https://your-api.com'

figma.showUI(__html__)

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'load-constellation') {
    const response = await fetch(
      `${CONSTELLATION_API}/api/constellation?communityId=${msg.communityId}`
    )
    const data = await response.json()

    figma.ui.postMessage({
      type: 'constellation-loaded',
      constellation: data.constellation,
    })
  }

  if (msg.type === 'apply-pillar-color') {
    const nodes = figma.currentPage.selection
    const color = hexToRgb(msg.colorHex)

    nodes.forEach((node) => {
      if ('fills' in node) {
        node.fills = [{ type: 'SOLID', color }]
      }
    })
  }
}
```

**UI** (`ui.html`):
```html
<script>
  async function loadConstellation() {
    parent.postMessage({
      pluginMessage: {
        type: 'load-constellation',
        communityId: 'your-community'
      }
    }, '*')
  }

  onmessage = (event) => {
    const msg = event.data.pluginMessage
    if (msg.type === 'constellation-loaded') {
      renderPillars(msg.constellation.graph.nodes.filter(n => n.type === 'pillar'))
    }
  }

  function renderPillars(pillars) {
    // Display pillars with colors, click to apply
  }
</script>
```

### Adobe XD / Sketch

Export constellation as design tokens:

```bash
npm run cli -- export your-community > constellation.json
```

Convert to design tokens:

```javascript
const constellation = require('./constellation.json')

const tokens = {
  color: {},
}

constellation.pillars.forEach((pillar) => {
  if (pillar.colorHex) {
    tokens.color[pillar.key] = {
      value: pillar.colorHex,
      type: 'color',
      description: pillar.name,
    }
  }
})

fs.writeFileSync('design-tokens.json', JSON.stringify(tokens, null, 2))
```

---

## Analytics Integration

### Google Analytics / Mixpanel

Track which symbols/pillars resonate with users:

```typescript
// Track content engagement by constellation tags
function trackContentEngagement(contentId: string) {
  // Fetch content piece
  const content = await fetch(`/api/content/${contentId}`).then(r => r.json())

  // Send to analytics
  gtag('event', 'content_engagement', {
    symbols: content.content.symbols.map(s => s.symbol.name),
    pillars: content.content.pillars.map(p => p.pillar.name),
    content_type: content.content.contentType,
  })
}
```

### Data Warehouse (BigQuery, Snowflake)

Export constellation data for analysis:

```bash
# Export daily
npm run cli -- export your-community > exports/constellation-$(date +%Y%m%d).json

# Load into BigQuery
bq load \
  --source_format=NEWLINE_DELIMITED_JSON \
  dataset.symbols \
  constellation.json \
  schema.json
```

Create views for analysis:

```sql
-- Most used symbols in published content
SELECT
  s.name as symbol_name,
  COUNT(DISTINCT cps.contentPieceId) as content_count
FROM symbols s
JOIN content_piece_symbols cps ON s.id = cps.symbolId
JOIN content_pieces cp ON cps.contentPieceId = cp.id
WHERE cp.status = 'published'
GROUP BY s.name
ORDER BY content_count DESC
LIMIT 10
```

---

## Webhook Integration

### Setup Webhook Endpoint

```typescript
// Your service webhook handler
app.post('/webhooks/constellation', async (req, res) => {
  const event = req.body as ConstellationEvent

  switch (event.type) {
    case 'symbol.created':
      await handleNewSymbol(event.data)
      break

    case 'link.created':
      await updateRecommendationEngine(event.data)
      break

    case 'content.published':
      await notifyTeam(event.data)
      break
  }

  res.status(200).send('OK')
})
```

### Configure Constellation to Send Webhooks

```bash
# .env
WEBHOOK_URL=https://your-service.com/webhooks/constellation
```

The `WebhookNotificationAdapter` will automatically send events.

### Slack Integration via Webhooks

```typescript
async function handleNewSymbol(data: any) {
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `New symbol created: ${data.name}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*New Symbol: ${data.name}*\n${data.description}`,
          },
        },
      ],
    }),
  })
}
```

---

## API Client Libraries

### TypeScript Client

```typescript
// constellation-client.ts
export class ConstellationClient {
  constructor(private baseUrl: string, private communityId: string) {}

  async getSymbols(category?: string) {
    const params = new URLSearchParams({ communityId: this.communityId })
    if (category) params.append('category', category)

    const response = await fetch(`${this.baseUrl}/api/symbols?${params}`)
    return response.json()
  }

  async createSymbol(data: CreateMythicSymbol) {
    const response = await fetch(`${this.baseUrl}/api/symbols`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, communityId: this.communityId }),
    })
    return response.json()
  }

  async getConstellation() {
    const response = await fetch(
      `${this.baseUrl}/api/constellation?communityId=${this.communityId}`
    )
    return response.json()
  }

  async createContent(data: CreateContentPiece) {
    const response = await fetch(`${this.baseUrl}/api/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, communityId: this.communityId }),
    })
    return response.json()
  }
}

// Usage
const client = new ConstellationClient('https://constellation.example.com', 'my-community')
const { symbols } = await client.getSymbols('animal')
```

### Python Client

```python
import requests
from typing import List, Dict, Optional

class ConstellationClient:
    def __init__(self, base_url: str, community_id: str):
        self.base_url = base_url
        self.community_id = community_id

    def get_symbols(self, category: Optional[str] = None) -> List[Dict]:
        params = {'communityId': self.community_id}
        if category:
            params['category'] = category

        response = requests.get(f'{self.base_url}/api/symbols', params=params)
        response.raise_for_status()
        return response.json()['symbols']

    def create_symbol(self, data: Dict) -> Dict:
        data['communityId'] = self.community_id
        response = requests.post(
            f'{self.base_url}/api/symbols',
            json=data
        )
        response.raise_for_status()
        return response.json()['symbol']

    def get_constellation(self) -> Dict:
        response = requests.get(
            f'{self.base_url}/api/constellation',
            params={'communityId': self.community_id}
        )
        response.raise_for_status()
        return response.json()['constellation']

# Usage
client = ConstellationClient('https://constellation.example.com', 'my-community')
symbols = client.get_symbols(category='animal')
```

---

## Real-World Workflow Examples

### Content Planning Workflow

1. **Content strategist** uses constellation API to find symbols for upcoming campaign
2. **System queries** `/api/pillars/{pillarId}` to get linked symbols
3. **Writer** creates content draft, tags with symbol IDs
4. **On publish**, webhook creates ContentPiece in constellation
5. **Analytics** tracks which symbols drive engagement
6. **Next cycle**, strategist queries most engaging symbols

### Design System Workflow

1. **Designer** exports constellation: `npm run cli -- export brand`
2. **Script** converts pillar colors to design tokens
3. **Figma plugin** loads tokens and symbols
4. **Designer** applies pillar colors to components
5. **Component library** references symbols in documentation
6. **Updates** to constellation auto-sync to design tools

### Campaign Execution Workflow

1. **Query** constellation for theme: `/api/themes/{themeId}`
2. **Get** all symbols and pillars in theme
3. **Query** existing content: `/api/content?pillarId=X&symbolId=Y`
4. **Identify** content gaps
5. **Create** new content pieces tagged with constellation
6. **Track** campaign performance by constellation elements

---

**Last Updated**: Phase 3 (Post deep expansion)
