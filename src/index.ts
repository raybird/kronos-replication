import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0429.2000]: Liquidity Void & Volatility Self-Similarity.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Causal Density = (Trajectory Alignment * Synergy) / (Memory Decay * Chaos).
 * 3. Sovereignty is achieved through matching current action with high-power historical nodes.
 */
export class KronosTokenizer {
  /**
   * Identifies the current Market Regime with Multi-Scale Entropy.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 60) return MarketRegime.LowVolatilityRange;

    const last = history[history.length - 1];
    const lookback60 = history.slice(-60);
    
    const move = (last.close - lookback60[0].close) / lookback60[0].close;
    const avgClose = lookback60.reduce((sum, k) => sum + k.close, 0) / 60;
    const volatility = Math.sqrt(lookback60.reduce((sum, k) => sum + Math.pow(k.close - avgClose, 2), 0) / 60) / avgClose;

    if (volatility > 0.085) return MarketRegime.HighVolatilityRange;
    if (move > 0.06) return MarketRegime.BullishTrending;
    if (move < -0.06) return MarketRegime.BearishTrending;
    
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Structural Memory.
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

    // --- 1. TRAJECTORY ALIGNMENT (Path Matching) ---
    const currentSlope = (current.close - history[history.length - 5].close) / 5;
    const histBreakouts = history.slice(-50, -5).filter((k, i, arr) => 
      i > 0 && k.volume > volAvg * 2.5 && Math.abs(k.close - arr[i-1].close) > rangeAvg * 1.5
    );
    const isAligned = histBreakouts.some(ob => Math.sign(currentSlope) === Math.sign(ob.close - history[history.indexOf(ob)-1].close));

    if (isAligned && current.volume > volAvg * 1.8) {
      tokens.push({
        type: `TRAJECTORY_ALIGNMENT_${currentSlope > 0 ? "BULL" : "BEAR"}`,
        confidence: 0.94,
        causalDensity: 5.8
      });
    }

    // --- 2. LIQUIDITY VOID (New v2.0) ---
    // Detect "Fast Price Gaps" where price moves significantly on lower relative volume
    // This indicates a lack of opposing interest (The Void)
    if (body > rangeAvg * 2.5 && current.volume < volAvg * 1.5) {
      tokens.push({
        type: `LIQUIDITY_VOID_${current.close > current.open ? "UP" : "DOWN"}`,
        confidence: 0.92,
        causalDensity: 9.1 // Extremely high causal significance
      });
    }

    // --- 3. PRICING POWER SUSTENANCE ---
    const prev = history[history.length - 2];
    const thrust = (current.close - current.open);
    const prevThrust = (prev.close - prev.open);
    
    if (Math.abs(thrust) > rangeAvg * 1.2 && current.volume > volAvg * 1.2) {
      const sustainFactor = (Math.abs(thrust) / Math.abs(prevThrust || 1));
      tokens.push({
        type: `PRICING_POWER_${thrust > 0 ? "EXPANSION" : "COLLAPSE"}`,
        confidence: Math.min(0.98, 0.8 * sustainFactor),
        causalDensity: 7.2
      });
    }

    // --- 4. FRACTAL VOLATILITY POLARIZATION ---
    const upperShadow = current.high - Math.max(current.open, current.close);
    const lowerShadow = Math.min(current.open, current.close) - current.low;
    
    if (current.volume > volAvg * 2.0) {
      if (upperShadow < range * 0.1 && thrust > 0) {
        tokens.push({ type: "POLARIZATION_BULL_INTENT", confidence: 0.97, causalDensity: 8.5 });
      } else if (lowerShadow < range * 0.1 && thrust < 0) {
        tokens.push({ type: "POLARIZATION_BEAR_INTENT", confidence: 0.97, causalDensity: 8.5 });
      }
    }

    // --- 5. CPCV & VOLATILITY SELF-SIMILARITY ---
    const synergyBonus = tokens.length >= 2 ? 2.1 : 1.0;
    const fractalVol = (range / rangeAvg);
    const regimePrior = (regime === MarketRegime.BullishTrending || regime === MarketRegime.BearishTrending) ? 1.9 : 0.1;

    tokens.forEach(t => {
      // Self-similarity scaling: Penalize noise-induced tokens
      const similarityScale = Math.exp(-Math.abs(fractalVol - 1.0));
      t.causalDensity *= (synergyBonus * regimePrior * similarityScale);
      
      (t as any).pathId = `PATH_${Date.now()}`;
      (t as any).embargoBars = 20; 
      (t as any).recordedAt = history.length - 1;
      (t as any).vYYMMDD_HHMM = "v26.0429.2000";
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => {
      const age = currentBarIndex - (t as any).recordedAt;
      return age >= (t as any).embargoBars;
    });
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Liquidity Void & Volatility Self-Similarity [v26.0429.2000]");
