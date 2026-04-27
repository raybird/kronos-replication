import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0428.0430]: Ensemble Scoring & Trajectory Pathing.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Collective Intent'.
 * 2. Causal Density = (Ensemble Gain * Synergy) / (Entropy * Decay).
 * 3. Sovereignty is achieved through multi-agent intent fusion & purged validation.
 */
export class KronosTokenizer {
  /**
   * Identifies the current Market Regime with Multi-Scale Entropy & Displacement awareness.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 60) return MarketRegime.LowVolatilityRange;

    const last = history[history.length - 1];
    const lookback60 = history.slice(-60);
    
    const move = (last.close - lookback60[0].close) / lookback60[0].close;
    const avgClose = lookback60.reduce((sum, k) => sum + k.close, 0) / 60;
    const volatility = Math.sqrt(lookback60.reduce((sum, k) => sum + Math.pow(k.close - avgClose, 2), 0) / 60) / avgClose;

    // Regime Classification (Enhanced Thresholds)
    if (volatility > 0.085) return MarketRegime.HighVolatilityRange;
    if (move > 0.06) return MarketRegime.BullishTrending;
    if (move < -0.06) return MarketRegime.BearishTrending;
    
    const volMA = lookback60.reduce((a, b) => a + b.volume, 0) / 60;
    if (last.volume > volMA * 6.5) return MarketRegime.Exhaustion;

    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Ensemble-Ready semantic decoding.
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
    const upperTail = current.high - Math.max(current.open, current.close);
    const lowerTail = Math.min(current.open, current.close) - current.low;

    // --- 1. ENSEMBLE PERCEPTION: STRUCTURAL AUDIT ---
    // High-conviction Absorption detection
    if (current.volume > volAvg * 4.0 && body / range < 0.1) {
      const type = upperTail > lowerTail ? "ENSEMBLE_ABSORPTION_SUPPLY" : "ENSEMBLE_ABSORPTION_DEMAND";
      tokens.push({
        type,
        confidence: 0.99, // Ensemble baseline
        causalDensity: 7.5 // Peak density for intent fusion
      });
    }

    // --- 2. TRAJECTORY PATHING: DISPLACEMENT_VELOCITY ---
    const pathVelocity = body / rangeAvg;
    if (pathVelocity > 3.5 && current.volume > volAvg * 2.5) {
      tokens.push({
        type: `TRAJECTORY_PATH_VELOCITY_${current.close > current.open ? "BULL" : "BEAR"}`,
        confidence: 0.97,
        causalDensity: 6.8
      });
    }

    // --- 3. LIQUIDITY ENSEMBLE: RECURSIVE VOID fill ---
    const recentVoid = history.slice(-50, -1).some(k => (k.high - k.low) > rangeAvg * 3.0 && k.volume < volAvg);
    if (recentVoid && current.volume > volAvg * 1.5 && (lowerTail > body || upperTail > body)) {
      tokens.push({
        type: "ENSEMBLE_LIQUIDITY_REVERSAL",
        confidence: 0.94,
        causalDensity: 5.5
      });
    }

    // --- 4. PURGED VALIDATION METADATA ---
    // Adding context for EnsembleInference layer
    const synergyBonus = tokens.length >= 2 ? 2.0 : 1.0;
    const regimePrior = (regime === MarketRegime.BullishTrending || regime === MarketRegime.BearishTrending) ? 1.8 : 
                        (regime === MarketRegime.HighVolatilityRange) ? 0.05 : 1.0;

    let cbs = 0; 
    tokens.forEach(t => {
      t.causalDensity *= (synergyBonus * regimePrior);
      
      const direction = t.type.includes("BULL") || t.type.includes("DEMAND") || t.type.includes("REVERSAL") ? 1 : -1;
      cbs += (t.causalDensity * direction);

      // Ensemble Metadata
      (t as any).ensembleLayer = "PERCEPTION_STRUCTURAL";
      (t as any).purgedAge = 0; // Fresh signal
      (t as any).halfLife = t.type.includes("ABSORPTION") ? 96 : 8; // Extended half-life for structural intents
      (t as any).vYYMMDD_HHMM = "v26.0428.0430";
    });

    (tokens as any).cbs = cbs; 
    (tokens as any).ensembleStatus = "READY_FOR_FUSION";

    return tokens;
  }

  /**
   * Filters out stale tokens using Bayesian Decay and Purging principles.
   */
  public static filterCausalDecay(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => {
      const age = currentBarIndex - (t as any).recordedAt;
      const decay = Math.pow(0.5, age / (t as any).halfLife);
      const isPurged = (t as any).purgedStatus === "INVALIDATED";
      return !isPurged && (t.causalDensity * decay > 2.0); 
    });
  }
}

// Execution Trace
console.log("Kronos Replication Engine Evolved: Ensemble & Pathing Mode [v26.0428.0430]");
