import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0423.0431]: Shifted from pattern matching to structure auditing.
 */
export class KronosTokenizer {
  /**
   * Identifies the current Market Regime based on historical context.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 5) return MarketRegime.LowVolatilityRange;

    const last = history[history.length - 1];
    const first = history[history.length - 5];
    
    // Simple Trend Calculation
    const move = (last.close - first.close) / first.close;
    
    // Volatility Calculation (Standard Deviation Approximation)
    const avgClose = history.reduce((sum, k) => sum + k.close, 0) / history.length;
    const variance = history.reduce((sum, k) => sum + Math.pow(k.close - avgClose, 2), 0) / history.length;
    const volatility = Math.sqrt(variance) / avgClose;

    if (volatility > 0.02) return MarketRegime.HighVolatilityRange;
    if (move > 0.01) return MarketRegime.BullishTrending;
    if (move < -0.01) return MarketRegime.BearishTrending;
    if (last.volume > history[history.length - 2].volume * 3) return MarketRegime.Exhaustion;

    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Identifies tokens with deep causal intent by analyzing structural shifts.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 2) return tokens;

    const current = history[history.length - 1];
    const previous = history[history.length - 2];

    // 1. LIQUIDITY_SWEEP (Learning from SMC spirit)
    // Occurs when current low sweeps below previous significant low then closes higher
    if (current.low < previous.low && current.close > previous.close) {
      tokens.push({
        type: "LIQUIDITY_SWEEP_BULL",
        confidence: 0.78,
        causalDensity: 1.4
      });
    }

    // 2. IMBALANCE / FVG DETECTION
    // High-speed move leaving a gap in market structure
    if (history.length >= 3) {
      const h3 = history[history.length - 3];
      if (current.low > h3.high) {
        tokens.push({
          type: "FAIR_VALUE_GAP_UP",
          confidence: 0.88,
          causalDensity: 1.8
        });
      }
    }

    // 3. CLASSIC ENGULFING (Refined)
    if (current.close > previous.open && current.open < previous.close && previous.close < previous.open) {
      tokens.push({
        type: "ENGULFING_BULL",
        confidence: 0.85,
        causalDensity: 1.2
      });
    }

    // 4. VOLUMETRIC EXHAUSTION
    if (current.volume > history.slice(-10).reduce((a, b) => a + b.volume, 0) / 10 * 3) {
      tokens.push({
        type: "CLIMACTIC_VOLUME",
        confidence: 0.95,
        causalDensity: 2.1
      });
    }

    return tokens;
  }
}

console.log("Kronos Replication Engine Evolved: Spirit Inheritance Mode [v26.0423.0431]");
