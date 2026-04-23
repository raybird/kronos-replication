import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0424.0435]: Quantifying Volatility Compression & Structural Anchoring.
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
   * Identifies tokens with macro anchoring and compression awareness.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 10) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    const volAvg = history.slice(-20).reduce((a, b) => a + b.volume, 0) / 20;
    
    // 1. VOLATILITY_COMPRESSION (The VCP Spirit)
    const avgRange = history.slice(-10).reduce((sum, k) => sum + (k.high - k.low), 0) / 10;
    if ((current.high - current.low) < avgRange * 0.5) {
      tokens.push({
        type: "VOLATILITY_COMPRESSION",
        confidence: 0.85,
        causalDensity: 2.0
      });
    }

    // 2. PRICING_POWER_BULL
    if (current.close > current.open && (current.close - current.low) / (current.high - current.low) > 0.8 && current.volume > volAvg * 1.5) {
      tokens.push({
        type: "PRICING_POWER_BULL",
        confidence: 0.88,
        causalDensity: 2.2
      });
    }

    // 3. INSTITUTIONAL_ABSORPTION
    if (Math.abs(current.close - current.open) < (current.high - current.low) * 0.15 && current.volume > volAvg * 3.0) {
      tokens.push({
        type: "INSTITUTIONAL_ABSORPTION",
        confidence: 0.90,
        causalDensity: 2.5
      });
    }

    // 4. LIQUIDITY_SWEEP
    if (current.low < previous.low && current.close > previous.close) {
      tokens.push({
        type: "LIQUIDITY_SWEEP_BULL",
        confidence: 0.85,
        causalDensity: 1.5
      });
    }

    // 5. IMBALANCE / FVG
    const h3 = history[history.length - 3];
    if (current.low > h3.high) {
      tokens.push({
        type: "FAIR_VALUE_GAP_UP",
        confidence: 0.92,
        causalDensity: 2.1
      });
    }

    // Synergy & Macro Anchoring (Simulated weight for key levels)
    const synergyBonus = tokens.length >= 2 ? 1.35 : 1.0;
    tokens.forEach(t => {
      t.causalDensity *= synergyBonus;
      // Macro Anchor: If in a Trending regime, amplify directionally aligned tokens
      if (regime === MarketRegime.BullishTrending && t.type.includes("BULL")) t.causalDensity *= 1.25;
      if (regime === MarketRegime.BearishTrending && t.type.includes("BEAR")) t.causalDensity *= 1.25;
    });

    return tokens;
  }
}

console.log("Kronos Replication Engine Evolved: Volatility Compression Mode [v26.0424.0435]");
