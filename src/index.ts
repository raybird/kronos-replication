import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0423.0831]: Integrated Regime-aware Causal Weights.
 */
export class KronosTokenizer {
  /**
   * Identifies the current Market Regime based on historical context.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 10) return MarketRegime.LowVolatilityRange;

    const last = history[history.length - 1];
    const first = history[history.length - 10];
    
    const move = (last.close - first.close) / first.close;
    const avgClose = history.reduce((sum, k) => sum + k.close, 0) / history.length;
    const variance = history.reduce((sum, k) => sum + Math.pow(k.close - avgClose, 2), 0) / history.length;
    const volatility = Math.sqrt(variance) / avgClose;

    if (volatility > 0.03) return MarketRegime.HighVolatilityRange;
    if (move > 0.015) return MarketRegime.BullishTrending;
    if (move < -0.015) return MarketRegime.BearishTrending;
    
    const volMA = history.slice(-10).reduce((a, b) => a + b.volume, 0) / 10;
    if (last.volume > volMA * 2.5) return MarketRegime.Exhaustion;

    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Identifies tokens with regime-aware causal weights.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 3) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    const h3 = history[history.length - 3];

    // Regime Weight Multiplier
    const regimeMult = regime === MarketRegime.BullishTrending || regime === MarketRegime.BearishTrending ? 1.5 : 1.0;

    // 1. LIQUIDITY_SWEEP (Refined)
    if (current.low < previous.low && current.close > previous.close) {
      tokens.push({
        type: "LIQUIDITY_SWEEP_BULL",
        confidence: 0.82,
        causalDensity: 1.4 * regimeMult
      });
    }

    // 2. ORDER_BLOCK_DETECTION (Structural Rejection)
    if (Math.abs(current.close - current.open) < (current.high - current.low) * 0.3 && 
        current.volume > previous.volume * 1.5) {
      tokens.push({
        type: "ORDER_BLOCK_STRIKE",
        confidence: 0.75,
        causalDensity: 1.6
      });
    }

    // 3. IMBALANCE / FVG
    if (current.low > h3.high) {
      tokens.push({
        type: "FAIR_VALUE_GAP_UP",
        confidence: 0.90,
        causalDensity: 1.8 * (regime === MarketRegime.BullishTrending ? 1.2 : 1.0)
      });
    }

    // 4. VOLUMETRIC EXHAUSTION
    const volAvg = history.slice(-20).reduce((a, b) => a + b.volume, 0) / 20;
    if (current.volume > volAvg * 3) {
      tokens.push({
        type: "CLIMACTIC_VOLUME",
        confidence: 0.95,
        causalDensity: 2.2
      });
    }

    return tokens;
  }
}

console.log("Kronos Replication Engine Evolved: Regime-Aware Weighting [v26.0423.0831]");
