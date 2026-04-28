import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0429.0430]: Ensemble Pathing & Volatility Squeeze.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Collective Intent'.
 * 2. Causal Density = (Ensemble Gain * Synergy) / (Path Correlation * Decay).
 * 3. Sovereignty is achieved through multi-path combinatorial validation.
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
   * Main tokenization logic implementing Ensemble-Ready Intent.
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

    // --- 1. VOLATILITY SQUEEZE (Structural Compression) ---
    // BB width < KC width proxy: range shrinking + volume dry-up
    const isSqueezed = range < rangeAvg * 0.4 && current.volume < volAvg * 0.6;
    if (isSqueezed) {
      tokens.push({
        type: "VOLATILITY_SQUEEZE_COMPRESSION",
        confidence: 0.92,
        causalDensity: 5.2 // High explosive potential
      });
    }

    // --- 2. INSTITUTIONAL ABSORPTION (Spirit v6) ---
    if (current.volume > volAvg * 4.0 && body / range < 0.1) {
      const type = upperTail > lowerTail ? "ABSORPTION_SUPPLY" : "ABSORPTION_DEMAND";
      tokens.push({
        type,
        confidence: 0.99,
        causalDensity: 6.8 
      });
    }

    // --- 3. ENSEMBLE PATHING: DISPLACEMENT_VELOCITY ---
    const displacement = body / rangeAvg;
    if (displacement > 3.5 && current.volume > volAvg * 2.5) {
      tokens.push({
        type: `ENSEMBLE_DISPLACEMENT_${current.close > current.open ? "BULL" : "BEAR"}`,
        confidence: 0.97,
        causalDensity: 6.0
      });
    }

    // --- 4. CPCV METADATA INJECTION ---
    const synergyBonus = tokens.length >= 2 ? 2.0 : 1.0;
    const regimePrior = (regime === MarketRegime.BullishTrending || regime === MarketRegime.BearishTrending) ? 1.8 : 0.2;

    let cbs = 0; 
    tokens.forEach(t => {
      t.causalDensity *= (synergyBonus * regimePrior);
      
      const direction = t.type.includes("BULL") || t.type.includes("DEMAND") ? 1 :
                        t.type.includes("BEAR") || t.type.includes("SUPPLY") ? -1 : 0;
      
      cbs += (t.causalDensity * direction);

      // CPCV-Ready Metadata
      (t as any).purged = false;
      (t as any).embargoBars = 18; // 18-bar embargo for high-density validation
      (t as any).ensembleId = `ENS_${Date.now()}`;
      (t as any).vYYMMDD_HHMM = "v26.0429.0430";
    });

    (tokens as any).cbs = cbs; 

    return tokens;
  }

  /**
   * Validates tokens against CPCV Purging/Embargo rules.
   */
  public static validateCausalPath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => {
      const age = currentBarIndex - (t as any).recordedAt;
      return age >= (t as any).embargoBars && !(t as any).purged;
    });
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Ensemble Pathing Mode [v26.0429.0430]");
