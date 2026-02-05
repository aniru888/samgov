/**
 * Markdown-Aware Text Chunker
 * Splits extracted text into ~500-token chunks for embedding.
 * Respects heading boundaries and preserves section metadata.
 *
 * Cohere embed-multilingual-v3 max: 512 tokens per text
 * Target: 300-500 tokens per chunk
 */

import type { ChunkMetadata } from "../types";

/** Target chunk size in tokens (Cohere max is 512, leave headroom) */
const TARGET_CHUNK_TOKENS = 450;

/** Minimum chunk size to avoid tiny fragments */
const MIN_CHUNK_TOKENS = 50;

/** Approximate characters per token (~3.5 for multilingual) */
const CHARS_PER_TOKEN = 3.5;

/**
 * Chunk with metadata, ready for embedding
 */
export interface TextChunk {
  content: string;
  metadata: ChunkMetadata;
  token_count: number;
}

/**
 * Estimate token count from text length
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

/**
 * Extract heading text from a markdown heading line
 */
function extractHeading(line: string): string | undefined {
  const match = line.match(/^#{1,6}\s+(.+)/);
  return match ? match[1].trim() : undefined;
}

/**
 * Split text by heading boundaries, preserving hierarchy
 */
function splitByHeadings(
  text: string
): Array<{ heading?: string; content: string }> {
  const lines = text.split("\n");
  const sections: Array<{ heading?: string; content: string }> = [];
  let currentHeading: string | undefined = undefined;
  let currentLines: string[] = [];

  for (const line of lines) {
    const heading = extractHeading(line);
    if (heading) {
      // Save previous section if it has content
      if (currentLines.length > 0) {
        const content = currentLines.join("\n").trim();
        if (content.length > 0) {
          sections.push({ heading: currentHeading, content });
        }
      }
      currentHeading = heading;
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  // Don't forget the last section
  if (currentLines.length > 0) {
    const content = currentLines.join("\n").trim();
    if (content.length > 0) {
      sections.push({ heading: currentHeading, content });
    }
  }

  return sections;
}

/**
 * Split text by paragraph boundaries (double newlines)
 */
function splitByParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/**
 * Split text by sentence boundaries
 */
function splitBySentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by whitespace
  return text
    .split(/(?<=[.!?।])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Split a large text block into chunks of approximately targetTokens size
 */
function splitToTargetSize(
  text: string,
  targetTokens: number
): string[] {
  const tokens = estimateTokens(text);

  if (tokens <= targetTokens) {
    return [text];
  }

  // Try splitting by paragraphs first
  const paragraphs = splitByParagraphs(text);
  if (paragraphs.length > 1) {
    return mergeToTargetSize(paragraphs, targetTokens);
  }

  // If single paragraph, split by sentences
  const sentences = splitBySentences(text);
  if (sentences.length > 1) {
    return mergeToTargetSize(sentences, targetTokens);
  }

  // Last resort: hard split by character count
  const charsPerChunk = Math.floor(targetTokens * CHARS_PER_TOKEN);
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += charsPerChunk) {
    chunks.push(text.slice(i, i + charsPerChunk));
  }
  return chunks;
}

/**
 * Merge small text fragments into chunks of approximately targetTokens
 */
function mergeToTargetSize(
  fragments: string[],
  targetTokens: number
): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  for (const fragment of fragments) {
    const combined = currentChunk
      ? currentChunk + "\n\n" + fragment
      : fragment;
    const combinedTokens = estimateTokens(combined);

    if (combinedTokens > targetTokens) {
      // Save current chunk if it has content
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
      }

      // Check if the fragment itself is too large and needs further splitting
      if (estimateTokens(fragment) > targetTokens) {
        const subChunks = splitToTargetSize(fragment, targetTokens);
        chunks.push(...subChunks.slice(0, -1));
        currentChunk = subChunks[subChunks.length - 1] || "";
      } else {
        currentChunk = fragment;
      }
    } else {
      currentChunk = combined;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Chunk extracted text into embedding-ready pieces.
 *
 * For Markdown (from LlamaParse): splits by heading boundaries, then paragraphs
 * For plain text (from pdf-parse): splits by paragraphs, then sentences
 *
 * @param text - Extracted text or markdown
 * @param isMarkdown - Whether the text is structured Markdown
 * @param pageCount - Total pages in the source document
 * @param language - Detected language
 * @returns Array of text chunks with metadata
 */
export function chunkText(
  text: string,
  isMarkdown: boolean,
  pageCount: number,
  language: "en" | "kn" | "mixed"
): TextChunk[] {
  const chunks: TextChunk[] = [];

  if (isMarkdown) {
    // Markdown: split by headings first, then by size
    const sections = splitByHeadings(text);

    for (const section of sections) {
      const sectionTokens = estimateTokens(section.content);

      if (sectionTokens <= TARGET_CHUNK_TOKENS) {
        if (sectionTokens >= MIN_CHUNK_TOKENS) {
          chunks.push({
            content: section.content,
            metadata: {
              section: section.heading,
              extraction_method: "ocr",
            },
            token_count: sectionTokens,
          });
        }
      } else {
        // Section too large - split further
        const subChunks = splitToTargetSize(
          section.content,
          TARGET_CHUNK_TOKENS
        );
        for (const subChunk of subChunks) {
          const tokenCount = estimateTokens(subChunk);
          if (tokenCount >= MIN_CHUNK_TOKENS) {
            chunks.push({
              content: subChunk,
              metadata: {
                section: section.heading,
                extraction_method: "ocr",
              },
              token_count: tokenCount,
            });
          }
        }
      }
    }
  } else {
    // Plain text: split by paragraphs
    const paragraphs = splitByParagraphs(text);
    const mergedChunks = mergeToTargetSize(paragraphs, TARGET_CHUNK_TOKENS);

    for (const chunk of mergedChunks) {
      const tokenCount = estimateTokens(chunk);
      if (tokenCount >= MIN_CHUNK_TOKENS) {
        chunks.push({
          content: chunk,
          metadata: {
            extraction_method: "native",
          },
          token_count: tokenCount,
        });
      }
    }
  }

  // Add page and language info to all chunks
  const pagesPerChunk = chunks.length > 0 ? pageCount / chunks.length : 0;
  for (let i = 0; i < chunks.length; i++) {
    chunks[i].metadata.page_number = Math.min(
      Math.ceil((i + 1) * pagesPerChunk),
      pageCount
    );
    // Language is tracked at document level, not per-chunk in metadata
    // but we include it for search optimization
    if (language !== "en") {
      // Store non-English language hint in section metadata for search
      chunks[i].metadata.section =
        (chunks[i].metadata.section || "") +
        (chunks[i].metadata.section ? ` [${language}]` : `[${language}]`);
    }
  }

  return chunks;
}
