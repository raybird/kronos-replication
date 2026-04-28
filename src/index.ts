import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0428.0830]: Structural Memory & Purged Embargo.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Intent'.
 * 2. Causal Density = (Information Gain * Structural Synergy) / (Embargo * Decay).
 * 3. Sovereignty is achieved through historical memory validation & physical isolation.
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

    // --- 1. STRUCTURAL MEMORY: ORDER BLOCK VALIDATION ---
    // Detecting if price is interacting with a previous high-volume tight-range zone
    const historicalOBs = history.slice(-50, -10).filter(k => 
      k.volume > volAvg * 2.5 && (k.high - k.low) < rangeAvg * 0.8
    );
    const interactingOB = historicalOBs.find(ob => 
      current.low <= ob.high && current.high >= ob.low
    );

    if (interactingOB && current.volume > volAvg * 1.5) {
      tokens.push({
        type: "STRUCTURAL_OB_RETEST",
        confidence: 0.95,
        causalDensity: 6.5
      });
    }

    // --- 2. ENSEMBLE PERCEPTION: ABSORPTION ---
    if (current.volume > volAvg * 3.5 && body / range < 0.15) {
      tokens.push({
        type: "ENSEMBLE_ABSORPTION",
        confidence: 0.98,
        causalDensity: 7.0
      });
    }

    // --- 3. PURGED EMBARGO METADATA ---
    const synergyBonus = tokens.length >= 2 ? 1.9 : 1.0;
    const regimePrior = (regime === MarketRegime.BullishTrending || regime === MarketRegime.BearishTrending) ? 1.7 : 1.0;

    let cbs = 0;
    tokens.forEach(t => {
      t.causalDensity *= (synergyBonus * regimePrior);
      
      // Embargo Discipline: Setting a mandatory cooling period
      (t as any).embargoBars = 12; // 12-bar embargo for causal isolation
      (t as any).recordedAt = history.length - 1;
      (t as any).vYYMMDD_HHMM = "v26.0428.0830";
    });

    return tokens;
  }

  /**
   * Validates tokens against the Embargo规訓.
   */
  public static validateEmbargo(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => {
      const age = currentBarIndex - (t as any).recordedAt;
      return age >= (t as any).embargoBars; // Signal only valid after embargo
    });
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Structural Memory Mode [v26.0428.0830]");
