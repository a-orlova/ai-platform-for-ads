import type { OllamaGenerateRawResponse } from '../api/ollamaClient'

export function extractOllamaTextResponse(result: OllamaGenerateRawResponse): string {
  if (typeof result.response === 'string') return result.response
  return JSON.stringify(result.response ?? result)
}

