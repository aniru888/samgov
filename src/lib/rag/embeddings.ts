/**
 * Embeddings Client
 * Uses Cohere embed-multilingual-v3 for multilingual embeddings (1024 dims)
 * Supports 100+ languages including Kannada
 *
 * Free tier: 1000 requests/month
 */

/**
 * Embedding dimensions for Cohere embed-multilingual-v3 model
 */
export const EMBEDDING_DIMENSIONS = 1024;

/**
 * Cohere API configuration
 */
const COHERE_API_URL = "https://api.cohere.ai/v1/embed";
const COHERE_MODEL = "embed-multilingual-v3.0";

/**
 * Get Cohere API key from environment
 * @throws Error if COHERE_API_KEY is not set
 */
function getCohereApiKey(): string {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "COHERE_API_KEY environment variable is not set. " +
        "Get a free API key at https://dashboard.cohere.com/api-keys"
    );
  }
  return apiKey;
}

/**
 * Generate embedding for a single text
 * Uses Cohere embed-multilingual-v3 for multilingual support
 * @param text - Text to embed (supports English, Kannada, and 100+ languages)
 * @returns 1024-dimensional embedding vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const embeddings = await generateEmbeddingsBatch([text]);
  return embeddings[0];
}

/**
 * Generate embeddings for multiple texts (batched)
 * Uses Cohere's native batch API for efficiency
 * @param texts - Array of texts to embed (supports 100+ languages)
 * @returns Array of 1024-dimensional embedding vectors
 */
export async function generateEmbeddingsBatch(
  texts: string[]
): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  const apiKey = getCohereApiKey();

  // Cohere supports up to 96 texts per request
  const COHERE_BATCH_SIZE = 96;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += COHERE_BATCH_SIZE) {
    const batch = texts.slice(i, i + COHERE_BATCH_SIZE);

    const response = await fetch(COHERE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: COHERE_MODEL,
        texts: batch,
        input_type: "search_document", // Use "search_query" for queries
        embedding_types: ["float"],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cohere API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    if (!data.embeddings?.float || !Array.isArray(data.embeddings.float)) {
      throw new Error("Invalid embedding response from Cohere");
    }

    // Validate dimensions
    for (const embedding of data.embeddings.float) {
      if (embedding.length !== EMBEDDING_DIMENSIONS) {
        throw new Error(
          `Invalid embedding dimensions: expected ${EMBEDDING_DIMENSIONS}, got ${embedding.length}`
        );
      }
    }

    allEmbeddings.push(...data.embeddings.float);
  }

  return allEmbeddings;
}

/**
 * Generate embedding for a query (uses different input_type for better retrieval)
 * @param query - Query text to embed
 * @returns 1024-dimensional embedding vector
 */
export async function generateQueryEmbedding(query: string): Promise<number[]> {
  const apiKey = getCohereApiKey();

  const response = await fetch(COHERE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: COHERE_MODEL,
      texts: [query],
      input_type: "search_query", // Different from documents for better retrieval
      embedding_types: ["float"],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cohere API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  if (!data.embeddings?.float?.[0]) {
    throw new Error("Invalid embedding response from Cohere");
  }

  const embedding = data.embeddings.float[0];

  if (embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Invalid embedding dimensions: expected ${EMBEDDING_DIMENSIONS}, got ${embedding.length}`
    );
  }

  return embedding;
}

/**
 * Calculate cosine similarity between two vectors
 * @param a - First vector
 * @param b - Second vector
 * @returns Similarity score between 0 and 1
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);

  if (denominator === 0) {
    return 0;
  }

  return dotProduct / denominator;
}

/**
 * Normalize a vector to unit length
 * @param vector - Vector to normalize
 * @returns Normalized vector
 */
export function normalizeVector(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));

  if (norm === 0) {
    return vector;
  }

  return vector.map((val) => val / norm);
}

/**
 * Validate that an embedding has the correct format
 * @param embedding - Embedding to validate
 * @returns true if valid
 */
export function isValidEmbedding(embedding: unknown): embedding is number[] {
  if (!Array.isArray(embedding)) {
    return false;
  }

  if (embedding.length !== EMBEDDING_DIMENSIONS) {
    return false;
  }

  return embedding.every((val) => typeof val === "number" && !isNaN(val));
}
