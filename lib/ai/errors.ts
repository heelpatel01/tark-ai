// ─────────────────────────────────────────────────────────────────────────────
// Provider error classification.
//
// Transient errors (rate limits, capacity, overload) are worth retrying;
// permanent ones (deprecated model, bad key) are not. Providers throw
// TransientProviderError for the former so the evaluator can retry/fall back.
// ─────────────────────────────────────────────────────────────────────────────

export class TransientProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransientProviderError";
  }
}

export function isTransientProviderError(err: unknown): err is TransientProviderError {
  return err instanceof TransientProviderError;
}
