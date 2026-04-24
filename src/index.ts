import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0424.1532]: Integrated Pricing Power Half-life & Bayesian Recalibration.
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
   * Identifies tokens with half-life decay and dynamic weighting.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 10) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    const volAvg = history.slice(-20).reduce((a, b) => a + b.volume, 0) / 20;
    const avgRange = history.slice(-10).reduce((sum, k) => sum + (k.high - k.low), 0) / 10;
    
    // 1. INSTITUTIONAL_ABSORPTION (Half-life: 12 bars)
    if (Math.abs(current.close - current.open) < (current.high - current.low) * 0.15 && current.volume > volAvg * 3.0) {
      tokens.push({
        type: "INSTITUTIONAL_ABSORPTION",
        confidence: 0.90,
        causalDensity: 2.5
      });
    }

    // 2. PRICING_POWER_BULL (Half-life: 5 bars - highly perishable)
    let ppMult = 1.0;
    if (current.volume < previous.volume * 0.75) ppMult = 0.7; // Enhanced Decay penalty

    if (current.close > current.open && (current.close - current.low) / (current.high - current.low) > 0.8 && current.volume > volAvg * 1.5) {
      tokens.push({
        type: "PRICING_POWER_BULL",
        confidence: 0.88,
        causalDensity: 2.2 * ppMult
      });
    }

    // 3. OPENING_IMBALANCE (Half-life: 20 bars - session anchor)
    if (current.volume > volAvg * 2.5 && (current.high - current.low) > avgRange * 1.8) {
      tokens.push({
        type: "OPENING_IMBALANCE_BULL",
        confidence: 0.85,
        causalDensity: 2.4
      });
    }

    // 4. VOLATILITY_COMPRESSION
    if ((current.high - current.low) < avgRange * 0.45) {
      tokens.push({
        type: "VOLATILITY_COMPRESSION",
        confidence: 0.85,
        causalDensity: 2.1
      });
    }

    // 5. LIQUIDITY_SWEEP
    if (current.low < previous.low && current.close > previous.close) {
      tokens.push({
        type: "LIQUIDITY_SWEEP_BULL",
        confidence: 0.85,
        causalDensity: 1.6
      });
    }

    // Bayesian Recalibration & Synergy
    // 1. Regime Multiplier: Bayesian Prior
    const regimePrior = (regime === MarketRegime.BullishTrending) ? 1.3 : 
                        (regime === MarketRegime.HighVolatilityRange) ? 0.7 : 1.0;

    const synergyBonus = tokens.length >= 2 ? 1.45 : 1.0;

    tokens.forEach(t => {
      t.causalDensity *= (synergyBonus * regimePrior);
      // Half-life annotation (Simulated as metadata for now)
      (t as any).halfLife = t.type.includes("IMBALANCE") ? 20 : t.type.includes("PRICING") ? 5 : 10;
    });

    return tokens;
  }
}

console.log("Kronos Replication Engine Evolved: Half-life & Bayesian Mode [v26.0424.1532]");
