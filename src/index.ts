import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0425.2032]: Polarization Strength & Causal Entropy Auditing.
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
   * Identifies tokens with polarization and entropy awareness.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 20) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-20).reduce((a, b) => a + b.volume, 0) / 20;
    const avgRange = history.slice(-10).reduce((sum, k) => sum + (k.high - k.low), 0) / 10;
    
    // 1. POLARIZATION_STRENGTH (Quality of Aggression)
    const bodySize = Math.abs(current.close - current.open);
    const totalSize = current.high - current.low;
    if (current.volume > volAvg * 2.0 && bodySize / totalSize > 0.9) {
      tokens.push({
        type: "POLARIZATION_MAX_STRENGTH",
        confidence: 0.95,
        causalDensity: 3.5 // Highest density for pure physical intent
      });
    }

    // 2. CAUSAL_ENTROPY_CHURN (Market Indecision at High Volume)
    if (current.volume > volAvg * 3.0 && bodySize / totalSize < 0.2) {
      tokens.push({
        type: "CAUSAL_ENTROPY_CHURN",
        confidence: 0.88,
        causalDensity: 3.2
      });
    }

    // 3. EXHAUSTION_DIVERGENCE
    const prevImpulsiveVol = history.slice(-20, -1).reduce((m, k) => Math.max(m, k.volume), 0);
    const recentHigh = history.slice(-20, -1).reduce((m, k) => Math.max(m, k.high), 0);
    const recentLow  = history.slice(-20, -1).reduce((m, k) => Math.min(m, k.low), Infinity);

    if (current.high > recentHigh && current.volume < prevImpulsiveVol * 0.5) {
      tokens.push({
        type: "EXHAUSTION_DIVERGENCE_BEAR",
        confidence: 0.85,
        causalDensity: 3.1
      });
    }

    // 4. STRUCTURAL_BREAK
    if (current.close > recentHigh && current.volume > volAvg * 1.5) {
      tokens.push({
        type: "STRUCTURAL_BREAK_BULL",
        confidence: 0.92,
        causalDensity: 2.8
      });
    }

    // Bayesian & Intent Auditing
    const synergyBonus = tokens.length >= 2 ? 1.7 : 1.0;
    const regimePrior = (regime === MarketRegime.BullishTrending) ? 1.55 : 
                        (regime === MarketRegime.HighVolatilityRange) ? 0.45 : 1.0;

    tokens.forEach(t => {
      t.causalDensity *= (synergyBonus * regimePrior);
      // Half-life metadata
      (t as any).halfLife = t.type.includes("POLARIZATION") ? 15 : t.type.includes("CHURN") ? 5 : 10;
    });

    return tokens;
  }
}

console.log("Kronos Replication Engine Evolved: Max Polarization & Churn Mode [v26.0425.2032]");
