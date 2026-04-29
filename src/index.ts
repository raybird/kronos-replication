import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0430.0430]: Dynamic Regime & Path-Consistency (CPCV-Inspired).
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Causal Density = (Trajectory Alignment * Synergy) / (Memory Decay * Chaos).
 * 3. Sovereignty is achieved through matching current action with high-power historical nodes.
 */
export class KronosTokenizer {
  /**
   * Identifies the current Market Regime using Volatility-Adjusted Thresholds.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 60) return MarketRegime.LowVolatilityRange;

    const last = history[history.length - 1];
    const lookback60 = history.slice(-60);
    
    // Use ATR-based dynamic thresholding instead of fixed percentages
    const ranges = lookback60.map(k => k.high - k.low);
    const atr = ranges.reduce((a, b) => a + b, 0) / 60;
    const move = (last.close - lookback60[0].close);
    
    const avgClose = lookback60.reduce((sum, k) => sum + k.close, 0) / 60;
    const volatility = Math.sqrt(lookback60.reduce((sum, k) => sum + Math.pow(k.close - avgClose, 2), 0) / 60) / avgClose;

    // Regime classification based on Volatility Multipliers
    if (volatility > 0.085) return MarketRegime.HighVolatilityRange;
    if (move > atr * 3.5) return MarketRegime.BullishTrending;
    if (move < -atr * 3.5) return MarketRegime.BearishTrending;
    
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Path-Consistency & Structural Memory.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens; // Higher requirement for multi-path check

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const recent = history.slice(-20);
    const rangeAvg = recent.reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    const body = Math.abs(current.close - current.open);
    const range = current.high - current.low;
    const thrust = (current.close - current.open);

    // --- 1. CPCV-INSPIRED PATH CONSISTENCY CHECK ---
    // Instead of one lookback, we check multiple "universes" (different window lengths)
    const windows = [5, 10, 20];
    const consistency = windows.map(w => {
      const slope = (current.close - history[history.length - w].close) / w;
      return Math.sign(slope);
    });
    const isPathConsistent = consistency.every(v => v === consistency[0]);

    if (isPathConsistent && Math.abs(current.close - history[history.length - 5].close) > rangeAvg * 1.2) {
      tokens.push({
        type: `PATH_CONSISTENCY_${consistency[0] > 0 ? "BULL" : "BEAR"}`,
        confidence: 0.95,
        causalDensity: 6.5
      });
    }

    // --- 2. TRAJECTORY ALIGNMENT (Structural Matching) ---
    const currentSlope = (current.close - history[history.length - 5].close) / 5;
    const histBreakouts = history.slice(-100, -5).filter((k, i, arr) => 
      i > 0 && k.volume > volAvg * 2.2 && Math.abs(k.close - arr[i-1].close) > rangeAvg * 1.3
    );
    const isAligned = histBreakouts.some(ob => Math.sign(currentSlope) === Math.sign(ob.close - history[history.indexOf(ob)-1].close));

    if (isAligned && current.volume > volAvg * 1.5) {
      tokens.push({
        type: `TRAJECTORY_ALIGNMENT`,
        confidence: 0.88,
        causalDensity: 5.2
      });
    }

    // --- 3. LIQUIDITY VOID (Imbalance Detection) ---
    if (body > rangeAvg * 2.8 && current.volume < volAvg * 1.2) {
      tokens.push({
        type: `LIQUIDITY_VOID`,
        confidence: 0.94,
        causalDensity: 10.5 // Top Tier Causal Signal
      });
    }

    // --- 4. POLARIZATION & EXHAUSTION ---
    const upperShadow = current.high - Math.max(current.open, current.close);
    const lowerShadow = Math.min(current.open, current.close) - current.low;
    
    if (current.volume > volAvg * 2.5) {
      if (upperShadow > range * 0.6) {
        tokens.push({ type: "BULL_EXHAUSTION", confidence: 0.91, causalDensity: 7.8 });
      } else if (lowerShadow > range * 0.6) {
        tokens.push({ type: "BEAR_EXHAUSTION", confidence: 0.91, causalDensity: 7.8 });
      }
    }

    // --- SYNERGY & POST-PROCESSING ---
    const synergyBonus = tokens.length >= 3 ? 2.5 : 1.2;
    const fractalVol = (range / rangeAvg);
    const regimePrior = (regime === MarketRegime.BullishTrending || regime === MarketRegime.BearishTrending) ? 2.0 : 0.5;

    tokens.forEach(t => {
      const similarityScale = Math.exp(-Math.abs(fractalVol - 1.0));
      t.causalDensity *= (synergyBonus * regimePrior * similarityScale);
      
      (t as any).pathId = `PATH_${Date.now()}`;
      (t as any).embargoBars = 15; 
      (t as any).recordedAt = history.length - 1;
      (t as any).vYYMMDD_HHMM = "v26.0430.0430";
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
console.log("Kronos Replication Engine Evolved: Dynamic Regime & Path-Consistency [v26.0430.0430]");

