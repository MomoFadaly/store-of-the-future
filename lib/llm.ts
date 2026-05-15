import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { ChatMessage } from "./types";

/**
 * LLM wrapper. Talks to the Anthropic API directly via @anthropic-ai/sdk.
 *
 * History note: this used to wrap @anthropic-ai/claude-agent-sdk, which is
 * a thin wrapper around the Claude Code CLI binary. That worked locally but
 * broke on Vercel — the CLI binary isn't present in the linux-x64 serverless
 * runtime, surfacing as "Native CLI binary for linux-x64 not found." For a
 * stateless serverless demo, the standard SDK is the right tool: no native
 * binary, no platform-specific dependencies, deterministic in any runtime.
 */

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-5";
const DEFAULT_MAX_TOKENS = 8192;

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // User-friendly — no env var names leaked to the page.
      // Server logs still get the technical detail below.
      console.error("[llm] ANTHROPIC_API_KEY missing — set it in Vercel env vars.");
      throw new Error("LIVE_PLANNER_OFFLINE");
    }
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

interface BaseParams {
  systemPrompt: string;
  messages: ChatMessage[];
  model?: string;
}

interface StructuredQueryParams extends BaseParams {
  schema: Record<string, unknown>;
}

/**
 * Convert our internal ChatMessage[] format to the Anthropic Messages API
 * shape. We keep the system prompt separate (system parameter), and turn
 * everything else into user/assistant turns.
 */
function toApiMessages(messages: ChatMessage[]): Anthropic.MessageParam[] {
  // Drop any system messages — they're handled via the `system` parameter.
  // Map "user" → user and everything else → assistant.
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));
}

/**
 * Single-shot structured call.
 *
 * Uses Anthropic's tool-use mechanism to enforce a JSON schema: we declare
 * a single tool whose input schema matches what we want, force the model
 * to use it, and read tool_use.input as the result.
 */
export async function structuredQuery<T>(
  params: StructuredQueryParams
): Promise<T> {
  const STRUCTURED_TOOL_NAME = "emit_structured_response";

  const response = await client().messages.create({
    model: params.model ?? DEFAULT_MODEL,
    max_tokens: DEFAULT_MAX_TOKENS,
    system: params.systemPrompt,
    messages: toApiMessages(params.messages),
    tools: [
      {
        name: STRUCTURED_TOOL_NAME,
        description:
          "Emit your final answer as a structured object matching the provided schema.",
        // The Anthropic SDK types input_schema as a JSONSchema-like object.
        input_schema: params.schema as Anthropic.Tool.InputSchema,
      },
    ],
    tool_choice: { type: "tool", name: STRUCTURED_TOOL_NAME },
  });

  const toolUse = response.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
  );

  if (!toolUse) {
    // Surface the text the model returned in case it's diagnostic.
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join(" ")
      .slice(0, 200);
    throw new Error(
      `LLM did not emit the structured tool call. Model said: ${text || "(no text)"}`
    );
  }

  return toolUse.input as T;
}

/**
 * Streaming text generator — yields plain-text chunks as the model writes.
 *
 * Used for interview turns so the user sees the question appear in real time.
 */
export async function* streamingTextQuery(
  params: BaseParams
): AsyncGenerator<string, void, unknown> {
  const stream = client().messages.stream({
    model: params.model ?? DEFAULT_MODEL,
    max_tokens: DEFAULT_MAX_TOKENS,
    system: params.systemPrompt,
    messages: toApiMessages(params.messages),
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta" &&
      typeof event.delta.text === "string"
    ) {
      yield event.delta.text;
    }
  }
}
