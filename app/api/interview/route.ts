import { streamingTextQuery } from "@/lib/llm";
import { INTERVIEW_SYSTEM_PROMPT } from "@/lib/prompts";
import type { ChatMessage } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const ERROR_SENTINEL = "\n\n[STREAM-ERROR]: ";

interface InterviewRequestBody {
  messages: ChatMessage[];
}

export async function POST(request: Request) {
  let body: InterviewRequestBody;
  try {
    body = (await request.json()) as InterviewRequestBody;
  } catch {
    return new Response("Invalid JSON body.", { status: 400 });
  }

  if (!body.messages || body.messages.length === 0) {
    return new Response("messages required.", { status: 400 });
  }

  if (body.messages[0].role !== "user") {
    return new Response("First message must be from the user.", {
      status: 400,
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamingTextQuery({
          systemPrompt: INTERVIEW_SYSTEM_PROMPT,
          messages: body.messages,
          model: "claude-sonnet-4-6",
        })) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error.";
        console.error("[/api/interview] streaming failure:", error);
        try {
          controller.enqueue(encoder.encode(`${ERROR_SENTINEL}${message}`));
        } catch {}
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
