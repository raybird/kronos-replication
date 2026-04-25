import { FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0425.0831]: Causal Re-testing & Intent Consistency.
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

    if (volatility > 0.05) return MarketRegime.HighVolatilityRange;
    if (move > 0.02) return MarketRegime.BullishTrending;
    if (move < -0.02) return MarketRegime.BearishTrending;
    
    const volMA = history.slice(-20).reduce((a, b) => a + b.volume, 0) / 20;
    if (last.volume > volMA * 5.0) return MarketRegime.Exhaustion;

    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Identifies tokens with structural and re-testing awareness.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 15) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    const volAvg = history.slice(-20).reduce((a, b) => a + b.volume, 0) / 20;
    const avgRange = history.slice(-10).reduce((sum, k) => sum + (k.high - k.low), 0) / 10;
    
    // 1. CAUSAL_RETEST (Intent Validation)
    // Checking if price pulls back to a structural break level without high volume (healthy retest)
    const recentHigh = history.slice(-15, -2).reduce((m, k) => Math.max(m, k.high), 0);
    if (previous.high > recentHigh && current.low <= recentHigh && current.close > recentHigh && current.volume < volAvg) {
      tokens.push({
        type: "CAUSAL_RETEST_BULL",
        confidence: 0.88,
        causalDensity: 2.5
      });
    }

    // 2. STRUCTURAL_BREAK (BOS/CHoCH)
    if (current.close > recentHigh && current.volume > volAvg * 1.2) {
      tokens.push({
        type: "STRUCTURAL_BREAK_BULL",
        confidence: 0.92,
        causalDensity: 2.8
      });
    }

    // 3. DISPLACEMENT_IMPULSE
    if (Math.abs(current.close - current.open) > avgRange * 2.0 && current.volume > volAvg * 2.0) {
      tokens.push({
        type: "DISPLACEMENT_IMPULSE",
        confidence: 0.85,
        causalDensity: 2.6
      });
    }

    // 4. CAUSAL_SURPRISE_REVERSAL
    const isAntiRegime = (regime === MarketRegime.BullishTrending && current.close < current.open) ||
                         (regime === MarketRegime.BearishTrending && current.close > current.open);
    if (isAntiRegime && current.volume > volAvg * 2.5) {
      tokens.push({
        type: "CAUSAL_SURPRISE_REVERSAL",
        confidence: 0.82,
        causalDensity: 3.3
      });
    }

    // Bayesian & Consistency Weighting
    const synergyBonus = tokens.length >= 2 ? 1.6 : 1.0;
    const regimePrior = (regime === MarketRegime.BullishTrending) ? 1.45 : 
                        (regime === MarketRegime.HighVolatilityRange) ? 0.55 : 1.0;

    tokens.forEach(t => {
      t.causalDensity *= (synergyBonus * regimePrior);
      (t as any).halfLife = t.type.includes("RETEST") ? 8 : t.type.includes("BREAK") ? 25 : 12;
    });

    return tokens;
  }
}

console.log("Kronos Replication Engine Evolved: Causal Re-testing Mode [v26.0425.0831]");
