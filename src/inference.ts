import { FinancialToken, MarketRegime } from "./types";

/**
 * KronosInference: The "Semantic Brain" that replaces the neural model.
 * Spirit Inheritance [v26.0502.1130]: Self-Attention Gating & Causal Entropy Routing.
 */
export class KronosInference {
  private static previousBias: number = 0;

  /**
   * Synthesizes tokens into a unified Causal Bias score (-1.0 to 1.0).
   * v2.0: Includes PBO-Aware deflation to filter out overfitted coincidences.
   */
  public static synthesize(tokens: FinancialToken[], regime: MarketRegime): number {
    if (tokens.length === 0) {
      this.previousBias *= 0.5; // Natural decay of intent
      return 0;
    }

    let score = 0;
    let totalCausalDensity = 0;
    
    // Track direction distribution to estimate PBO risk
    const directions: number[] = [];

    tokens.forEach(token => {
      let multiplier = 1.0;
      
      // Attention Mechanism: Weighing tokens based on Regime
      if (regime === MarketRegime.BullishTrending && token.type.includes("BULL")) multiplier = 1.8;
      if (regime === MarketRegime.BearishTrending && token.type.includes("BEAR")) multiplier = 1.8;
      if (regime === MarketRegime.HighVolatilityRange) multiplier = 0.4; // High noise penalty

      const contribution = (token.type.includes("BULL") || token.type.includes("UP") || token.type.includes("EXPANSION")) ? 1 : -1;
      score += contribution * token.confidence * token.causalDensity * multiplier;
      totalCausalDensity += token.causalDensity;
      directions.push(contribution);
    });

    const currentBias = score / (totalCausalDensity || 1);
    
    // --- 1. PBO-AWARE DEFLATION (Curiosity Research v26.0430) ---
    // If tokens show conflicting directions, it suggests high variance/overfitting risk.
    const agreement = directions.filter(d => Math.sign(d) === Math.sign(currentBias)).length / directions.length;
    const pboDeflator = Math.pow(agreement, 2.5); // Aggressive deflation for low consensus

    // --- 2. Intent Persistence Check ---
    const biasDelta = Math.abs(currentBias - this.previousBias);
    const hasCatalyst = tokens.some(t => t.type.includes("VOID") || t.type.includes("EXHAUSTION") || t.type.includes("TRAJECTORY"));
    
    let persistencePenalty = 1.0;
    if (biasDelta > 1.2 && !hasCatalyst) {
      persistencePenalty = 0.3; // Heavy penalty for sudden shifts without structural catalyst
    }

    const finalScore = currentBias * pboDeflator * persistencePenalty;
    this.previousBias = finalScore;

    return Math.max(-1, Math.min(1, finalScore));
  }

  /**
   * Formulates a "Causal Intent Memo" for the LLM Brain to act upon.
   */
  public static generateIntentMemo(score: number, tokens: FinancialToken[]): string {
    const direction = score > 0.45 ? "STRONGLY_BULLISH" : score > 0.18 ? "BULLISH" : 
                    score < -0.45 ? "STRONGLY_BEARISH" : score < -0.18 ? "BEARISH" : "NEUTRAL";
    
    const confidenceLevel = Math.abs(score) > 0.6 ? "SOVEREIGN" : Math.abs(score) > 0.3 ? "RELIABLE" : "SPECULATIVE";

    return `[KRONOS_INFERENCE_v26.0502.1130] 
    Bias: ${direction} (${(score * 100).toFixed(2)}%)
    Confidence: ${confidenceLevel}
    Active Evidence: ${tokens.map(t => t.type).join(", ")}
    Action: ${direction.startsWith("STRONG") ? "EXECUTE_ATTENTION_GATED_CONVICTION" : "WAIT_FOR_CAUSAL_ENTROPY_ROUTING"}`;
  }
}

