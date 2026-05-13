import "server-only";
import { query, type Options } from "@anthropic-ai/claude-agent-sdk";
import type { ChatMessage } from "./types";

interface BaseParams {
  systemPrompt: string;
  messages: ChatMessage[];
  model?: string;
}

interface StructuredQueryParams extends BaseParams {
  schema: Record<string, unknown>;
}

function buildTranscript(messages: ChatMessage[]): string {
  return messages
    .map((m) => `[${m.role.toUpperCase()}]\n${m.content}`)
    .join("\n\n");
}

function baseOptions(params: BaseParams): Options {
  return {
    model: params.model ?? "claude-opus-4-7",
    systemPrompt: params.systemPrompt,
    tools: [],
    allowedTools: [],
    persistSession: false,
    thinking: { type: "disabled" },
  };
}

// Structured single-shot call with JSON schema enforcement.
// Used for plan synthesis where we want a structured object out.
export async function structuredQuery<T>(
  params: StructuredQueryParams
): Promise<T> {
  const options: Options = {
    ...baseOptions(params),
    outputFormat: { type: "json_schema", schema: params.schema },
  };

  const q = query({ prompt: buildTranscript(params.messages), options });

  for await (const msg of q) {
    if (msg.type === "result") {
      if (msg.subtype === "success") {
        if (msg.structured_output !== undefined) {
          return msg.structured_output as T;
        }
        try {
          return JSON.parse(msg.result) as T;
        } catch {
          throw new Error(
            `Model returned non-JSON: ${msg.result.slice(0, 200)}`
          );
        }
      }
      throw new Error(
        `LLM failed (${msg.subtype}): ${msg.errors.join("; ") || "no detail"}`
      );
    }
  }

  throw new Error("LLM query ended without a result message.");
}

// Streaming text generator — yields plain-text chunks as the model writes.
// Used for the interview turn so the user sees the question appear in real time.
export async function* streamingTextQuery(
  params: BaseParams
): AsyncGenerator<string, void, unknown> {
  const options: Options = {
    ...baseOptions(params),
    includePartialMessages: true,
  };

  const q = query({ prompt: buildTranscript(params.messages), options });

  for await (const msg of q) {
    if (msg.type === "stream_event") {
      const evt = msg.event as { type: string; delta?: { type: string; text?: string } };
      if (
        evt.type === "content_block_delta" &&
        evt.delta?.type === "text_delta" &&
        typeof evt.delta.text === "string"
      ) {
        yield evt.delta.text;
      }
    } else if (msg.type === "result") {
      if (msg.subtype !== "success") {
        throw new Error(
          `LLM failed (${msg.subtype}): ${msg.errors.join("; ") || "no detail"}`
        );
      }
      return;
    }
  }
}
