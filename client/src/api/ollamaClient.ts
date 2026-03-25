export type OllamaGenerateRawResponse = {
  model?: string
  created_at?: string
  response?: string
  done?: boolean
  context?: unknown
  error?: string
}

type GenerateOllamaInput = {
  prompt: string
  model?: string
}

const OLLAMA_GENERATE_URL = 'http://localhost:11434/api/generate'

export const generateOllama = async ({
  prompt,
  model = 'llama3',
}: GenerateOllamaInput): Promise<OllamaGenerateRawResponse> => {
  const res = await fetch(OLLAMA_GENERATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Ollama request failed: ${res.status} ${text}`)
  }

  const data = (await res.json().catch(() => ({}))) as OllamaGenerateRawResponse
  return data
}

