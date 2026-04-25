import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0425.1532]: Liquidity Polarization & Exhaustion Auditing.
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
   * Identifies tokens with polarization and exhaustion awareness.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 20) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-20).reduce((a, b) => a + b.volume, 0) / 20;
    const avgRange = history.slice(-10).reduce((sum, k) => sum + (k.high - k.low), 0) / 10;
    
    // 1. LIQUIDITY_POLARIZATION (One-sided Aggression)
    // High volume candle closing at extreme with very small wick opposite to trend
    const bodySize = Math.abs(current.close - current.open);
    const totalSize = current.high - current.low;
    if (current.volume > volAvg * 1.8 && bodySize / totalSize > 0.85) {
      const type = current.close > current.open ? "LIQUIDITY_POLARIZATION_BULL" : "LIQUIDITY_POLARIZATION_BEAR";
      tokens.push({
        type: type,
        confidence: 0.90,
        causalDensity: 2.9
      });
    }

    // 2. EXHAUSTION_DIVERGENCE (Trend Fatigue)
    // Price makes a 20-bar new high/low but volume is < 60% of previous impulsive peak
    const recentHigh = history.slice(-20, -1).reduce((m, k) => Math.max(m, k.high), 0);
    const recentLow  = history.slice(-20, -1).reduce((m, k) => Math.min(m, k.low), Infinity);
    const prevImpulsiveVol = history.slice(-20, -1).reduce((m, k) => Math.max(m, k.volume), 0);

    if (current.high > recentHigh && current.volume < prevImpulsiveVol * 0.6) {
      tokens.push({
        type: "EXHAUSTION_DIVERGENCE_BEAR",
        confidence: 0.85,
        causalDensity: 3.1
      });
    } else if (current.low < recentLow && current.volume < prevImpulsiveVol * 0.6) {
      tokens.push({
        type: "EXHAUSTION_DIVERGENCE_BULL",
        confidence: 0.85,
        causalDensity: 3.1
      });
    }

    // 3. STRUCTURAL_BREAK (BOS)
    if (current.close > recentHigh && current.volume > volAvg * 1.3) {
      tokens.push({
        type: "STRUCTURAL_BREAK_BULL",
        confidence: 0.92,
        causalDensity: 2.8
      });
    }

    // 4. CAUSAL_RETEST (Intent Validation)
    const h15High = history.slice(-15, -2).reduce((m, k) => Math.max(m, k.high), 0);
    if (history[history.length - 2].high > h15High && current.low <= h15High && current.close > h15High && current.volume < volAvg) {
      tokens.push({
        type: "CAUSAL_RETEST_BULL",
        confidence: 0.88,
        causalDensity: 2.5
      });
    }

    // Bayesian & Exhaustion Weighting
    const synergyBonus = tokens.length >= 2 ? 1.65 : 1.0;
    const regimePrior = (regime === MarketRegime.BullishTrending) ? 1.5 : 
                        (regime === MarketRegime.HighVolatilityRange) ? 0.5 : 1.0;

    tokens.forEach(t => {
      t.causalDensity *= (synergyBonus * regimePrior);
      // Half-life metadata
      (t as any).halfLife = t.type.includes("EXHAUSTION") ? 4 : t.type.includes("BREAK") ? 25 : 8;
    });

    return tokens;
  }
}

console.log("Kronos Replication Engine Evolved: Polarization & Exhaustion Mode [v26.0425.1532]");
