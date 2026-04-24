import { FinancialToken, MarketRegime } from "./types";

/**
 * KronosInference: The "Semantic Brain" that replaces the neural model.
 * It uses causal aggregation to synthesize multiple tokens into a directional bias.
 */
export class KronosInference {
  /**
   * Synthesizes tokens into a unified Causal Bias score (-1.0 to 1.0).
   * This mimics the final layer of a neural network by aggregating weighted evidence.
   */
  public static synthesize(tokens: FinancialToken[], regime: MarketRegime): number {
    if (tokens.length === 0) return 0;

    let score = 0;
    let totalCausalDensity = 0;

    tokens.forEach(token => {
      let multiplier = 1.0;
      
      // Mimic "Attention Mechanism": Weigh certain tokens higher in specific regimes
      if (regime === MarketRegime.BullishTrending && token.type.includes("BULL")) multiplier = 1.5;
      if (regime === MarketRegime.BearishTrending && token.type.includes("BEAR")) multiplier = 1.5;
      if (regime === MarketRegime.HighVolatilityRange) multiplier = 0.6; // Noise penalty

      const contribution = token.type.includes("BULL") || token.type.includes("UP") ? 1 : -1;
      score += contribution * token.confidence * token.causalDensity * multiplier;
      totalCausalDensity += token.causalDensity;
    });

    // Normalize score
    const finalScore = score / (totalCausalDensity || 1);
    return Math.max(-1, Math.min(1, finalScore));
  }

  /**
   * Formulates a "Causal Intent Memo" for the LLM Brain to act upon.
   */
  public static generateIntentMemo(score: number, tokens: FinancialToken[]): string {
    const direction = score > 0.3 ? "STRONGLY_BULLISH" : score > 0.1 ? "BULLISH" : 
                    score < -0.3 ? "STRONGLY_BEARISH" : score < -0.1 ? "BEARISH" : "NEUTRAL";
    
    return `[KRONOS_INFERENCE] 
Bias: ${direction} (${(score * 100).toFixed(2)}%)
Active Evidence: ${tokens.map(t => t.type).join(", ")}
Action: ${direction.startsWith("STRONG") ? "EXECUTE_IMMEDIATELY" : "MONITOR_FLOW"}`;
  }
}
