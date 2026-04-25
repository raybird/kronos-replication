import { FinancialToken, MarketRegime } from "./types";

/**
 * KronosInference: The "Semantic Brain" that replaces the neural model.
 * Spirit Inheritance [v26.0426.0431]: Integrated Intent Persistence & Ghost Filtering.
 */
export class KronosInference {
  private static previousBias: number = 0;

  /**
   * Synthesizes tokens into a unified Causal Bias score (-1.0 to 1.0).
   * Includes persistence auditing to filter out erratic "Ghost Intents".
   */
  public static synthesize(tokens: FinancialToken[], regime: MarketRegime): number {
    if (tokens.length === 0) {
      this.previousBias *= 0.5; // Natural decay of intent
      return 0;
    }

    let score = 0;
    let totalCausalDensity = 0;

    tokens.forEach(token => {
      let multiplier = 1.0;
      
      // Attention Mechanism: Weighing tokens based on Regime
      if (regime === MarketRegime.BullishTrending && token.type.includes("BULL")) multiplier = 1.6;
      if (regime === MarketRegime.BearishTrending && token.type.includes("BEAR")) multiplier = 1.6;
      if (regime === MarketRegime.HighVolatilityRange) multiplier = 0.5; // High noise penalty

      const contribution = token.type.includes("BULL") || token.type.includes("UP") ? 1 : -1;
      score += contribution * token.confidence * token.causalDensity * multiplier;
      totalCausalDensity += token.causalDensity;
    });

    // Normalize raw score
    const currentBias = score / (totalCausalDensity || 1);
    
    // --- Intent Persistence Check (v1.0) ---
    const biasDelta = Math.abs(currentBias - this.previousBias);
    const hasCatalyst = tokens.some(t => t.type.includes("POLARIZATION") || t.type.includes("SURPRISE") || t.type.includes("BREAK"));
    
    let persistencePenalty = 1.0;
    if (biasDelta > 1.0 && !hasCatalyst) {
      persistencePenalty = 0.4; // Heavy penalty for erratic shifts lacking physical displacement
    }

    const finalScore = currentBias * persistencePenalty;
    this.previousBias = finalScore; // Update memory for next bar

    return Math.max(-1, Math.min(1, finalScore));
  }

  /**
   * Formulates a "Causal Intent Memo" for the LLM Brain to act upon.
   */
  public static generateIntentMemo(score: number, tokens: FinancialToken[]): string {
    const direction = score > 0.4 ? "STRONGLY_BULLISH" : score > 0.15 ? "BULLISH" : 
                    score < -0.4 ? "STRONGLY_BEARISH" : score < -0.15 ? "BEARISH" : "NEUTRAL";
    
    const consistency = Math.abs(score) > 0 ? "STABLE" : "FLUID";

    return `[KRONOS_INFERENCE] 
Bias: ${direction} (${(score * 100).toFixed(2)}%)
Consistency: ${consistency}
Active Evidence: ${tokens.map(t => t.type).join(", ")}
Action: ${direction.startsWith("STRONG") ? "EXECUTE_IMMEDIATELY" : "MONITOR_FLOW"}`;
  }
}
