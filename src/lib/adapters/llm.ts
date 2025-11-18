/**
 * LLM Adapter Interface
 *
 * Provides AI-powered suggestions for constellation building.
 * Implementations can use OpenAI, Anthropic, or other LLM providers.
 */

export interface SymbolSuggestion {
  name: string
  category: string
  description: string
  tags?: string[]
  culturalOrigin?: string
  confidence: number
}

export interface RelationshipSuggestion {
  fromSymbolId: string
  toSymbolId: string
  relationshipType: string
  reasoning: string
  confidence: number
}

export interface LLMAdapter {
  /**
   * Suggest symbols that might align with a brand pillar
   */
  suggestSymbolsForPillar(
    pillarName: string,
    pillarDescription: string,
    existingSymbols?: { name: string; category: string }[]
  ): Promise<SymbolSuggestion[]>

  /**
   * Suggest relationships between existing symbols
   */
  suggestSymbolRelationships(
    symbols: { id: string; name: string; description: string }[]
  ): Promise<RelationshipSuggestion[]>

  /**
   * Generate a rich description for a symbol or pillar
   */
  generateDescription(
    type: 'symbol' | 'pillar',
    name: string,
    context?: string
  ): Promise<string>

  /**
   * Suggest themes based on constellation structure
   */
  suggestThemes(constellation: {
    symbols: { name: string; category: string }[]
    pillars: { name: string }[]
  }): Promise<{
    name: string
    description: string
    symbolNames: string[]
    pillarNames: string[]
  }[]>
}

/**
 * No-Op LLM Adapter (stub implementation)
 */
export class NoOpLLMAdapter implements LLMAdapter {
  async suggestSymbolsForPillar(): Promise<SymbolSuggestion[]> {
    return []
  }

  async suggestSymbolRelationships(): Promise<RelationshipSuggestion[]> {
    return []
  }

  async generateDescription(): Promise<string> {
    return 'AI generation not configured. Set up an LLM adapter to enable this feature.'
  }

  async suggestThemes(): Promise<any[]> {
    return []
  }
}

/**
 * OpenAI Adapter (stub - to be implemented)
 */
export class OpenAIAdapter implements LLMAdapter {
  constructor(private apiKey: string) {}

  async suggestSymbolsForPillar(
    pillarName: string,
    pillarDescription: string
  ): Promise<SymbolSuggestion[]> {
    // TODO: Implement OpenAI API call
    console.log('OpenAI: Suggesting symbols for pillar:', pillarName)
    return []
  }

  async suggestSymbolRelationships(): Promise<RelationshipSuggestion[]> {
    // TODO: Implement OpenAI API call
    return []
  }

  async generateDescription(
    type: 'symbol' | 'pillar',
    name: string,
    context?: string
  ): Promise<string> {
    // TODO: Implement OpenAI API call
    return `AI-generated description for ${type}: ${name}`
  }

  async suggestThemes(): Promise<any[]> {
    // TODO: Implement OpenAI API call
    return []
  }
}

// Factory function
export function createLLMAdapter(): LLMAdapter {
  const apiKey = process.env.OPENAI_API_KEY

  if (apiKey) {
    return new OpenAIAdapter(apiKey)
  }

  return new NoOpLLMAdapter()
}
