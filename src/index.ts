import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0428.2030]: Intent Chaining & Causal Imbalance.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Chained Intent'.
 * 2. Causal Density = (Chain Probability * Synergy) / (Chaos * Decay).
 * 3. Sovereignty is achieved through tracking the causal transition between states.
 */
export class KronosTokenizer {
  /**
   * Identifies the current Market Regime with Path-Based Entropy.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 60) return MarketRegime.LowVolatilityRange;

    const last = history[history.length - 1];
    const lookback60 = history.slice(-60);
    
    const move = (last.close - lookback60[0].close) / lookback60[0].close;
    const avgClose = lookback60.reduce((sum, k) => sum + k.close, 0) / 60;
    const volatility = Math.sqrt(lookback60.reduce((sum, k) => sum + Math.pow(k.close - avgClose, 2), 0) / 60) / avgClose;

    let pathSum = 0;
    for (let i = 1; i < lookback60.length; i++) {
      pathSum += Math.abs(Math.log(lookback60[i].close / lookback60[i-1].close));
    }
    const netMove = Math.abs(Math.log(last.close / lookback60[0].close));
    const trajectoryEntropy = netMove === 0 ? pathSum : pathSum / netMove;

    if (volatility > 0.09 || trajectoryEntropy > 5.0) return MarketRegime.HighVolatilityRange;
    if (move > 0.06) return MarketRegime.BullishTrending;
    if (move < -0.06) return MarketRegime.BearishTrending;
    
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Chained Intent decoding.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 60) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const recent = history.slice(-20);
    const volAvg = history.slice(-60).reduce((a, b) => a + b.volume, 0) / 60;
    const rangeAvg = recent.reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    const body = Math.abs(current.close - current.open);
    const range = current.high - current.low;
    const upperWick = current.high - Math.max(current.open, current.close);
    const lowerWick = Math.min(current.open, current.close) - current.low;

    // --- 1. INTENT CHAINING: SWEEP TO BREAKOUT ---
    const localHigh = recent.slice(-10, -1).reduce((m, k) => Math.max(m, k.high), 0);
    const localLow  = recent.slice(-10, -1).reduce((m, k) => Math.min(m, k.low), Infinity);
    
    // Look for a sweep in the previous 5 bars
    const recentSweepBull = history.slice(-6, -1).some(k => k.low < localLow && k.close > localLow);
    const recentSweepBear = history.slice(-6, -1).some(k => k.high > localHigh && k.close < localHigh);

    if (recentSweepBull && current.close > localHigh && current.volume > volAvg * 2.0) {
      tokens.push({
        type: "CHAIN_SWEEP_CONFIRMED_BULL",
        confidence: 0.98,
        causalDensity: 8.5 // Extremely high causal power
      });
    }

    // --- 2. CAUSAL IMBALANCE (Net Aggression) ---
    const priceChange = (current.close - current.open) / current.open;
    const volWeight = current.volume / volAvg;
    if (Math.abs(priceChange) > (rangeAvg / current.open) * 2.0 && volWeight > 1.5) {
      tokens.push({
        type: `IMBALANCE_AGGRESSION_${current.close > current.open ? "BULL" : "BEAR"}`,
        confidence: 0.94,
        causalDensity: 6.2
      });
    }

    // --- 3. RECURSIVE LIQUIDITY AUDIT ---
    if (body > rangeAvg * 3.0 && current.volume < volAvg * 0.8) {
      tokens.push({
        type: `LIQUIDITY_GAP_${current.close > current.open ? "UP" : "DOWN"}`,
        confidence: 0.89,
        causalDensity: 4.5
      });
    }

    // --- 4. BAYESIAN META-WEIGHTING ---
    const synergyBonus = tokens.length >= 2 ? 2.0 : 1.0;
    const regimePrior = (regime === MarketRegime.BullishTrending || regime === MarketRegime.BearishTrending) ? 1.7 : 
                        (regime === MarketRegime.HighVolatilityRange) ? 0.2 : 1.0;

    tokens.forEach(t => {
      t.causalDensity *= (synergyBonus * regimePrior);
      
      // Half-life Metadata
      (t as any).halfLife = t.type.includes("CHAIN") ? 72 : t.type.includes("GAP") ? 24 : 12;
      (t as any).intent = t.type.includes("CHAIN") ? "MARKET_SHIFT" : "MOMENTUM";
      (t as any).vYYMMDD_HHMM = "v26.0428.2030";
    });

    return tokens;
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Chained Intent Mode [v26.0428.2030]");
