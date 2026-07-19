import { NextRequest } from "next/server";
import { CONSENSUS_MODELS, MAX_QUESTION_LENGTH } from "@/lib/ai/models";
import { runConsensus } from "@/lib/ai/orchestrator";
import { synthesizeFinalAnswer } from "@/lib/ai/evaluator";
import type { ConsensusEvent } from "@/lib/ai/types";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/self-consistency
//
// 1. The exact same question fans out to every configured model in parallel
//    (Promise.all). No model sees another model's response.
// 2. Each settled model is streamed to the client as an NDJSON event so the
//    UI shows progressive completion.
// 3. Only after ALL responses settle, the evaluator synthesizes one final
//    answer from the successful responses.
// 4. Failures degrade gracefully — a dead provider never crashes the run.
// ─────────────────────────────────────────────────────────────────────────────

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  let question: string;
  try {
    const body = await req.json();
    question = typeof body?.question === "string" ? body.question.trim() : "";
  } catch {
    question = "";
  }

  if (!question) {
    return Response.json({ error: "Question is required" }, { status: 400 });
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return Response.json(
      { error: `Question exceeds ${MAX_QUESTION_LENGTH} characters` },
      { status: 400 }
    );
  }

  const encoder = new TextEncoder();
  const send = (
    controller: ReadableStreamDefaultController,
    event: ConsensusEvent
  ) => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Phase 1 — parallel fan-out; stream each model as it settles.
        const responses = await runConsensus(CONSENSUS_MODELS, question, (response) =>
          send(controller, { type: "model", response })
        );

        // Phase 2 — evaluate successful responses only.
        const successful = responses.filter((r) => r.status === "completed");

        if (successful.length === 0) {
          send(controller, {
            type: "error",
            message:
              "All models failed to respond. Check provider configuration and try again.",
          });
          controller.close();
          return;
        }

        send(controller, { type: "phase", phase: "synthesizing" });

        try {
          const { finalAnswer, latencyMs } = await synthesizeFinalAnswer({
            question,
            responses: successful,
          });
          send(controller, { type: "final", answer: finalAnswer, latencyMs });
        } catch (err) {
          console.error("Evaluator error:", err);
          send(controller, {
            type: "error",
            message:
              "Could not synthesize a final answer. The individual responses above are still available.",
          });
        }

        controller.close();
      } catch (err) {
        console.error("Self-consistency stream error:", err);
        try {
          send(controller, { type: "error", message: "Something went wrong. Please try again." });
        } catch {
          /* controller may already be closed */
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
