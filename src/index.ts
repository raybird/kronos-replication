import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0425.0432]: Structural Breaks & Displacement Auditing.
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
   * Identifies tokens with structural and displacement awareness.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 15) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    const volAvg = history.slice(-20).reduce((a, b) => a + b.volume, 0) / 20;
    const avgRange = history.slice(-10).reduce((sum, k) => sum + (k.high - k.low), 0) / 10;
    
    // 1. STRUCTURAL_BREAK (BOS/CHoCH Spirit)
    // Detecting if price has broken the highest high of the last 15 bars with volume
    const recentHigh = history.slice(-15, -1).reduce((m, k) => Math.max(m, k.high), 0);
    const recentLow  = history.slice(-15, -1).reduce((m, k) => Math.min(m, k.low), Infinity);

    if (current.close > recentHigh && current.volume > volAvg * 1.2) {
      tokens.push({
        type: "STRUCTURAL_BREAK_BULL",
        confidence: 0.92,
        causalDensity: 2.8
      });
    } else if (current.close < recentLow && current.volume > volAvg * 1.2) {
      tokens.push({
        type: "STRUCTURAL_BREAK_BEAR",
        confidence: 0.92,
        causalDensity: 2.8
      });
    }

    // 2. DISPLACEMENT_IMPULSE
    // Rapid move leaving gaps and high volume (The 'Fair Value' shift)
    if (Math.abs(current.close - current.open) > avgRange * 2.0 && current.volume > volAvg * 2.0) {
      tokens.push({
        type: "DISPLACEMENT_IMPULSE",
        confidence: 0.85,
        causalDensity: 2.5
      });
    }

    // 3. CAUSAL_SURPRISE_REVERSAL (High Entropy)
    const isAntiRegime = (regime === MarketRegime.BullishTrending && current.close < current.open) ||
                         (regime === MarketRegime.BearishTrending && current.close > current.open);
    if (isAntiRegime && current.volume > volAvg * 2.5) {
      tokens.push({
        type: "CAUSAL_SURPRISE_REVERSAL",
        confidence: 0.82,
        causalDensity: 3.2
      });
    }

    // 4. INSTITUTIONAL_ABSORPTION
    if (Math.abs(current.close - current.open) < (current.high - current.low) * 0.15 && current.volume > volAvg * 3.0) {
      tokens.push({
        type: "INSTITUTIONAL_ABSORPTION",
        confidence: 0.90,
        causalDensity: 2.7
      });
    }

    // 5. PRICING_POWER_BULL (With Decay Penalty)
    let ppMult = 1.0;
    if (current.volume < previous.volume * 0.65) ppMult = 0.6; // Stricter Decay

    if (current.close > current.open && (current.close - current.low) / (current.high - current.low) > 0.8 && current.volume > volAvg * 1.5) {
      tokens.push({
        type: "PRICING_POWER_BULL",
        confidence: 0.88,
        causalDensity: 2.3 * ppMult
      });
    }

    // Bayesian & Structural Weighting
    const synergyBonus = tokens.length >= 2 ? 1.55 : 1.0;
    const regimePrior = (regime === MarketRegime.BullishTrending) ? 1.4 : 
                        (regime === MarketRegime.HighVolatilityRange) ? 0.6 : 1.0;

    tokens.forEach(t => {
      t.causalDensity *= (synergyBonus * regimePrior);
      // Half-life metadata
      (t as any).halfLife = t.type.includes("BREAK") ? 25 : t.type.includes("SURPRISE") ? 3 : 10;
    });

    return tokens;
  }
}

console.log("Kronos Replication Engine Evolved: Structural Auditing Mode [v26.0425.0432]");
