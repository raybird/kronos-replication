import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0427.2040]: Recursive Context & Zero-Shot Calibration.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Intent'.
 * 2. Causal Density = (Information Gain * Contextual Synergy) / Temporal Decay.
 * 3. Sovereignty is achieved through precise semantic decoding of institutional gravity.
 */
export class KronosTokenizer {
  /**
   * Identifies the current Market Regime with Multi-Scale Entropy.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 50) return MarketRegime.LowVolatilityRange;

    const last = history[history.length - 1];
    const shortTerm = history.slice(-10);
    const longTerm = history.slice(-50);
    
    const shortMove = (last.close - shortTerm[0].close) / shortTerm[0].close;
    const longMove = (last.close - longTerm[0].close) / longTerm[0].close;
    
    const avgClose = longTerm.reduce((sum, k) => sum + k.close, 0) / 50;
    const volatility = Math.sqrt(longTerm.reduce((sum, k) => sum + Math.pow(k.close - avgClose, 2), 0) / 50) / avgClose;

    // Regime Classification
    if (volatility > 0.08) return MarketRegime.HighVolatilityRange;
    if (longMove > 0.05 && shortMove > 0.01) return MarketRegime.BullishTrending;
    if (longMove < -0.05 && shortMove < -0.01) return MarketRegime.BearishTrending;
    
    const volMA = longTerm.reduce((a, b) => a + b.volume, 0) / 50;
    if (last.volume > volMA * 6.0) return MarketRegime.Exhaustion;

    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Institutional Intent decoding.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 50) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const recent = history.slice(-20);
    
    const volAvg = history.slice(-50).reduce((a, b) => a + b.volume, 0) / 50;
    const rangeAvg = recent.reduce((sum, k) => sum + (k.high - k.low), 0) / 20;
    
    const body = Math.abs(current.close - current.open);
    const range = current.high - current.low;
    const upperTail = current.high - Math.max(current.open, current.close);
    const lowerTail = Math.min(current.open, current.close) - current.low;

    // --- 1. INSTITUTIONAL ABSORPTION (Spirit v5) ---
    if (current.volume > volAvg * 3.5 && body / range < 0.12) {
      const type = upperTail > lowerTail ? "ABSORPTION_SUPPLY" : "ABSORPTION_DEMAND";
      tokens.push({
        type,
        confidence: 0.98,
        causalDensity: 6.2 // Peak density for high-conviction zones
      });
    }

    // --- 2. DYNAMIC PRESERVATION (Zero-Shot Calibration) ---
    // Preserving price dynamics by identifying displacement relative to average range
    const displacement = body / rangeAvg;
    if (displacement > 3.0 && current.volume > volAvg * 2.0) {
      tokens.push({
        type: `DYNAMIC_DISPLACEMENT_${current.close > current.open ? "BULL" : "BEAR"}`,
        confidence: 0.96,
        causalDensity: 5.5
      });
    }

    // --- 3. RECURSIVE LIQUIDITY AUDIT ---
    // Checking if current action revisits a previous Liquidity Void
    const prevVoidUp = history.slice(-30, -1).some(k => (k.high - k.low) > rangeAvg * 2.5 && k.volume < volAvg * 1.2);
    if (prevVoidUp && current.low <= history.slice(-30, -1).reduce((m, k) => Math.min(m, k.low), Infinity)) {
      tokens.push({
        type: "RECURSIVE_VOID_FILL",
        confidence: 0.92,
        causalDensity: 4.8
      });
    }

    // --- 4. HIERARCHICAL STATE ENTROPY (Adaptive) ---
    const entropy = Math.log(range / rangeAvg + 1);
    if (entropy < 0.3 && current.volume < volAvg * 0.7) {
      tokens.push({
        type: "STATE_EQUILIBRIUM",
        confidence: 0.85,
        causalDensity: 3.5
      });
    }

    // --- 5. BAYESIAN META-WEIGHTING & SCORING ---
    const synergyBonus = tokens.length >= 2 ? 1.8 : 1.0;
    const regimePrior = (regime === MarketRegime.BullishTrending || regime === MarketRegime.BearishTrending) ? 1.7 : 
                        (regime === MarketRegime.HighVolatilityRange) ? 0.1 : 1.0;

    let cbs = 0; // Causal Bias Score
    tokens.forEach(t => {
      t.causalDensity *= (synergyBonus * regimePrior);
      
      const direction = t.type.includes("BULL") || t.type.includes("DEMAND") || t.type.includes("VOID_FILL") ? 1 :
                        t.type.includes("BEAR") || t.type.includes("SUPPLY") ? -1 : 0;
      
      cbs += (t.causalDensity * direction);

      // Metadata for Inference Layer
      (t as any).halfLife = t.type.includes("ABSORPTION") ? 72 : 12;
      (t as any).vYYMMDD_HHMM = "v26.0427.2040";
    });

    (tokens as any).cbs = cbs; // Attach Causal Bias Score to token list

    return tokens;
  }

  /**
   * Filters out stale tokens based on their half-life.
   */
  public static filterCausalDecay(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => {
      const age = currentBarIndex - (t as any).recordedAt;
      const decay = Math.pow(0.5, age / (t as any).halfLife);
      return t.causalDensity * decay > 1.5; // Stricter pruning for end-of-day hardening
    });
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Recursive & Zero-Shot Mode [v26.0427.2040]");
