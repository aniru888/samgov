/**
 * LlamaParse REST Client
 * Calls LlamaParse v2 API for document parsing with Kannada OCR support.
 * No SDK needed - uses native fetch.
 *
 * Free tier: 10,000 credits/month
 * Cost Effective tier: 3 credits/page
 */

const LLAMAPARSE_BASE_URL = "https://api.cloud.llamaindex.ai/api/v2/parse";

/** Maximum time to wait for a parse job to complete (5 minutes) */
const PARSE_TIMEOUT_MS = 5 * 60 * 1000;

/** Polling interval when waiting for parse results (3 seconds) */
const POLL_INTERVAL_MS = 3000;

/**
 * LlamaParse job status
 */
type JobStatus = "PENDING" | "PROCESSING" | "SUCCESS" | "ERROR" | "CANCELLED";

/**
 * LlamaParse upload response
 */
interface UploadResponse {
  id: string;
  status: JobStatus;
}

/**
 * LlamaParse job result
 */
interface ParseResult {
  id: string;
  status: JobStatus;
  markdown?: string;
  metadata?: {
    total_pages?: number;
    credits_used?: number;
    [key: string]: unknown;
  };
  error_message?: string;
}

/**
 * Parsed document output from LlamaParse
 */
export interface LlamaParseOutput {
  markdown: string;
  pages: number;
  credits_used: number;
}

/**
 * Get LlamaParse API key from environment
 */
function getApiKey(): string {
  const apiKey = process.env.LLAMA_CLOUD_API_KEY;
  if (!apiKey) {
    throw new Error(
      "LLAMA_CLOUD_API_KEY environment variable is not set. " +
        "Get a free API key at https://cloud.llamaindex.ai/api-key"
    );
  }
  return apiKey;
}

/**
 * Upload a PDF to LlamaParse for parsing
 * Uses Cost Effective tier with Kannada + English OCR
 */
async function uploadDocument(
  pdfBuffer: Buffer,
  filename: string
): Promise<string> {
  const apiKey = getApiKey();

  const formData = new FormData();
  const blob = new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" });
  formData.append("file", blob, filename);
  formData.append(
    "configuration",
    JSON.stringify({
      tier: "cost_effective",
      version: "latest",
      processing_options: {
        ocr_parameters: {
          languages: ["kn", "en"],
        },
      },
    })
  );

  const response = await fetch(`${LLAMAPARSE_BASE_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 429) {
      throw new Error("LlamaParse rate limit exceeded. Please try again later.");
    }
    if (response.status === 402) {
      throw new Error(
        "LlamaParse monthly credit quota exhausted (10,000 credits/month)."
      );
    }
    throw new Error(
      `LlamaParse upload failed (${response.status}): ${errorText}`
    );
  }

  const data = (await response.json()) as UploadResponse;
  return data.id;
}

/**
 * Poll for parse job completion and return results
 */
async function pollForResult(jobId: string): Promise<ParseResult> {
  const apiKey = getApiKey();
  const startTime = Date.now();

  while (Date.now() - startTime < PARSE_TIMEOUT_MS) {
    const response = await fetch(
      `${LLAMAPARSE_BASE_URL}/${jobId}?expand=markdown,metadata`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `LlamaParse poll failed (${response.status}): ${errorText}`
      );
    }

    const result = (await response.json()) as ParseResult;

    if (result.status === "SUCCESS") {
      return result;
    }

    if (result.status === "ERROR" || result.status === "CANCELLED") {
      throw new Error(
        `LlamaParse job ${result.status}: ${result.error_message || "Unknown error"}`
      );
    }

    // Still processing - wait before polling again
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error(
    `LlamaParse job timed out after ${PARSE_TIMEOUT_MS / 1000}s. Job ID: ${jobId}`
  );
}

/**
 * Parse a PDF document using LlamaParse
 * Uploads the PDF, waits for processing, returns structured Markdown.
 *
 * @param pdfBuffer - PDF file as Buffer
 * @param filename - Original filename (for LlamaParse metadata)
 * @returns Parsed document as structured Markdown with metadata
 */
export async function parseWithLlamaParse(
  pdfBuffer: Buffer,
  filename: string
): Promise<LlamaParseOutput> {
  // Upload and start parsing
  const jobId = await uploadDocument(pdfBuffer, filename);

  // Poll for results
  const result = await pollForResult(jobId);

  if (!result.markdown) {
    throw new Error("LlamaParse returned empty markdown for job: " + jobId);
  }

  return {
    markdown: result.markdown,
    pages: result.metadata?.total_pages ?? 0,
    credits_used: result.metadata?.credits_used ?? 0,
  };
}
