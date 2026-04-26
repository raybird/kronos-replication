import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0426.1532]: Liquidity Sinks & Structural Pivot Hardening.
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

    if (volatility > 0.055) return MarketRegime.HighVolatilityRange;
    if (move > 0.02) return MarketRegime.BullishTrending;
    if (move < -0.02) return MarketRegime.BearishTrending;
    
    const volMA = history.slice(-20).reduce((a, b) => a + b.volume, 0) / 20;
    if (last.volume > volMA * 5.0) return MarketRegime.Exhaustion;

    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Identifies tokens with liquidity sink and pivot awareness.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 20) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-20).reduce((a, b) => a + b.volume, 0) / 20;
    const avgRange = history.slice(-10).reduce((sum, k) => sum + (k.high - k.low), 0) / 10;
    
    // 1. LIQUIDITY_SINK (Magnetic Absorption)
    // Ultra-high volume in a narrow range candle (Hidden Gravity)
    const bodySize = Math.abs(current.close - current.open);
    const totalSize = current.high - current.low;
    if (current.volume > volAvg * 3.5 && bodySize / totalSize < 0.15) {
      tokens.push({
        type: "LIQUIDITY_SINK_NEUTRAL",
        confidence: 0.92,
        causalDensity: 3.8 // Highest density for future magnetic levels
      });
    }

    // 2. STRUCTURAL_PIVOT_HARDENING
    const recentHigh = history.slice(-20, -1).reduce((m, k) => Math.max(m, k.high), 0);
    const recentLow  = history.slice(-20, -1).reduce((m, k) => Math.min(m, k.low), Infinity);
    if (Math.abs(current.close - recentHigh) < avgRange * 0.1 && totalSize < avgRange * 0.5) {
      tokens.push({
        type: "STRUCTURAL_PIVOT_HARDENING_BULL",
        confidence: 0.88,
        causalDensity: 2.9
      });
    }

    // 3. POLARIZATION_STRENGTH
    if (current.volume > volAvg * 2.2 && bodySize / totalSize > 0.92) {
      tokens.push({
        type: "POLARIZATION_MAX_STRENGTH",
        confidence: 0.95,
        causalDensity: 3.5
      });
    }

    // 4. EXHAUSTION_DIVERGENCE
    const prevImpulsiveVol = history.slice(-20, -1).reduce((m, k) => Math.max(m, k.volume), 0);
    if (current.high > recentHigh && current.volume < prevImpulsiveVol * 0.45) {
      tokens.push({
        type: "EXHAUSTION_DIVERGENCE_BEAR",
        confidence: 0.86,
        causalDensity: 3.2
      });
    }

    // Bayesian & Sink Weighting
    const synergyBonus = tokens.length >= 2 ? 1.75 : 1.0;
    const regimePrior = (regime === MarketRegime.BullishTrending) ? 1.6 : 
                        (regime === MarketRegime.HighVolatilityRange) ? 0.4 : 1.0;

    tokens.forEach(t => {
      t.causalDensity *= (synergyBonus * regimePrior);
      // Half-life metadata
      (t as any).halfLife = t.type.includes("SINK") ? 40 : t.type.includes("POLARIZATION") ? 12 : 8;
    });

    return tokens;
  }
}

console.log("Kronos Replication Engine Evolved: Liquidity Sinks & Pivot Mode [v26.0426.1532]");
