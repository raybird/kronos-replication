import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0423.2032]: Deciphering Institutional Pricing Power & Absorption.
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
   * Identifies tokens with institutional footprint awareness.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 5) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    const h3 = history[history.length - 3];
    const volAvg = history.slice(-20).reduce((a, b) => a + b.volume, 0) / 20;

    // 1. PRICING_POWER_BULL (Closing strength on volume)
    if (current.close > current.open && (current.close - current.low) / (current.high - current.low) > 0.8 && current.volume > volAvg * 1.5) {
      tokens.push({
        type: "PRICING_POWER_BULL",
        confidence: 0.88,
        causalDensity: 2.2
      });
    }

    // 2. INSTITUTIONAL_ABSORPTION
    // Narrow price action on ultra-high volume (Accumulation/Distribution)
    if (Math.abs(current.close - current.open) < (current.high - current.low) * 0.15 && current.volume > volAvg * 3.0) {
      tokens.push({
        type: "INSTITUTIONAL_ABSORPTION",
        confidence: 0.90,
        causalDensity: 2.5
      });
    }

    // 3. LIQUIDITY_SWEEP (SMC Spirit)
    if (current.low < previous.low && current.close > previous.close) {
      tokens.push({
        type: "LIQUIDITY_SWEEP_BULL",
        confidence: 0.85,
        causalDensity: 1.5
      });
    }

    // 4. CAUSAL_DIVERGENCE_BULL
    if (current.low < previous.low && current.volume < previous.volume * 0.4) {
      tokens.push({
        type: "CAUSAL_DIVERGENCE_BULL",
        confidence: 0.80,
        causalDensity: 1.9
      });
    }

    // 5. IMBALANCE / FVG
    if (current.low > h3.high) {
      tokens.push({
        type: "FAIR_VALUE_GAP_UP",
        confidence: 0.92,
        causalDensity: 2.1
      });
    }

    // Synergy Scaling
    const synergyBonus = tokens.length >= 2 ? 1.3 : 1.0;
    tokens.forEach(t => {
      t.causalDensity *= synergyBonus;
      if (regime === MarketRegime.BullishTrending && t.type.includes("BULL")) t.causalDensity *= 1.15;
    });

    return tokens;
  }
}

console.log("Kronos Replication Engine Evolved: Institutional Footprint Mode [v26.0423.2032]");
