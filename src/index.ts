import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0423.1532]: Implemented Causal Synergy & Structural Divergence.
 */
export class KronosTokenizer {
  /**
   * Identifies the current Market Regime based on historical context.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 20) return MarketRegime.LowVolatilityRange;

    const last = history[history.length - 1];
    const first = history[history.length - 20];
    
    const move = (last.close - first.close) / first.close;
    const avgClose = history.reduce((sum, k) => sum + k.close, 0) / history.length;
    const variance = history.reduce((sum, k) => sum + Math.pow(k.close - avgClose, 2), 0) / history.length;
    const volatility = Math.sqrt(variance) / avgClose;

    if (volatility > 0.04) return MarketRegime.HighVolatilityRange;
    if (move > 0.02) return MarketRegime.BullishTrending;
    if (move < -0.02) return MarketRegime.BearishTrending;
    
    const volMA = history.slice(-20).reduce((a, b) => a + b.volume, 0) / 20;
    if (last.volume > volMA * 4.0) return MarketRegime.Exhaustion;

    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Identifies tokens with synergistic causal weights.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 5) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    const h3 = history[history.length - 3];

    // 1. LIQUIDITY_SWEEP (SMC Spirit)
    if (current.low < previous.low && current.close > previous.close) {
      tokens.push({
        type: "LIQUIDITY_SWEEP_BULL",
        confidence: 0.85,
        causalDensity: 1.5
      });
    }

    // 2. ORDER_BLOCK_DETECTION
    if (Math.abs(current.close - current.open) < (current.high - current.low) * 0.25 && 
        current.volume > previous.volume * 2.0) {
      tokens.push({
        type: "ORDER_BLOCK_STRIKE",
        confidence: 0.80,
        causalDensity: 1.8
      });
    }

    // 3. CAUSAL_DIVERGENCE_BULL
    // Price makes lower low, but Volume is dry or previous sweep was high confidence
    if (current.low < previous.low && current.volume < previous.volume * 0.5) {
      tokens.push({
        type: "CAUSAL_DIVERGENCE_BULL",
        confidence: 0.75,
        causalDensity: 2.0
      });
    }

    // 4. IMBALANCE / FVG
    if (current.low > h3.high) {
      tokens.push({
        type: "FAIR_VALUE_GAP_UP",
        confidence: 0.92,
        causalDensity: 2.0
      });
    }

    // Synergy Scaling: If multiple tokens of the same polarity exist
    const synergyBonus = tokens.length >= 2 ? 1.25 : 1.0;
    tokens.forEach(t => {
      t.causalDensity *= synergyBonus;
      // Adjust by Regime
      if (regime === MarketRegime.BullishTrending && t.type.includes("BULL")) t.causalDensity *= 1.2;
    });

    return tokens;
  }
}

console.log("Kronos Replication Engine Evolved: Causal Synergy Mode [v26.0423.1532]");
