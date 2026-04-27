import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0427.1530]: Trajectory Distillation & Causal Decay.
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
    if (volatility > 0.075) return MarketRegime.HighVolatilityRange;
    if (longMove > 0.05 && shortMove > 0.01) return MarketRegime.BullishTrending;
    if (longMove < -0.05 && shortMove < -0.01) return MarketRegime.BearishTrending;
    
    const volMA = longTerm.reduce((a, b) => a + b.volume, 0) / 50;
    if (last.volume > volMA * 5.5) return MarketRegime.Exhaustion;

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

    // --- 1. INSTITUTIONAL ABSORPTION (Spirit v3) ---
    if (current.volume > volAvg * 3.0 && body / range < 0.2) {
      const type = upperTail > lowerTail ? "ABSORPTION_SUPPLY" : "ABSORPTION_DEMAND";
      tokens.push({
        type,
        confidence: 0.96,
        causalDensity: 5.5
      });
    }

    // --- 2. TRAJECTORY DISTILLATION (Momentum Velocity) ---
    // Detecting the "Speed" of price change relative to semantic weight
    const priceChange = (current.close - current.open) / current.open;
    const velocity = Math.abs(priceChange) / (rangeAvg / current.open);
    if (velocity > 2.5 && current.volume > volAvg * 1.5) {
      tokens.push({
        type: `MOMENTUM_VELOCITY_${current.close > current.open ? "BULL" : "BEAR"}`,
        confidence: 0.93,
        causalDensity: 4.8
      });
    }

    // --- 3. LIQUIDITY_VOID (Gravity Gap) ---
    if (body > rangeAvg * 2.8 && current.volume < volAvg * 1.0) {
      const type = current.close > current.open ? "LIQUIDITY_VOID_UP" : "LIQUIDITY_VOID_DOWN";
      tokens.push({
        type,
        confidence: 0.89,
        causalDensity: 4.2
      });
    }

    // --- 4. STRUCTURAL IMBALANCE (Aggression) ---
    if (current.volume > volAvg * 2.0 && body / range > 0.85) {
      tokens.push({
        type: `STRUCTURAL_IMBALANCE_${current.close > current.open ? "BULL" : "BEAR"}`,
        confidence: 0.94,
        causalDensity: 5.0
      });
    }

    // --- 5. CAUSAL DECAY & META-REGULATION ---
    const synergyBonus = tokens.length >= 2 ? 1.6 : 1.0;
    const regimePrior = (regime === MarketRegime.BullishTrending || regime === MarketRegime.BearishTrending) ? 1.5 : 
                        (regime === MarketRegime.HighVolatilityRange) ? 0.3 : 1.0;

    tokens.forEach(t => {
      t.causalDensity *= (synergyBonus * regimePrior);
      
      // Half-life metadata (Decay calibration)
      const halfLife = t.type.includes("ABSORPTION") ? 48 : 
                       t.type.includes("VOID") ? 24 : 
                       t.type.includes("VELOCITY") ? 6 : 12;
      
      (t as any).halfLife = halfLife;
      (t as any).intent = t.type.includes("ABSORPTION") ? "ACCUMULATION" : 
                          t.type.includes("VELOCITY") ? "AGGRESSION" : "NEUTRAL";
      (t as any).vYYMMDD_HHMM = "v26.0427.1530";
    });

    return tokens;
  }

  /**
   * Filters out stale tokens based on their half-life and elapsed time.
   */
  public static filterCausalDecay(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => {
      const age = currentBarIndex - (t as any).recordedAt;
      const decay = Math.pow(0.5, age / (t as any).halfLife);
      return t.causalDensity * decay > 1.0; // Prune low-signal noise
    });
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Trajectory & Decay Mode [v26.0427.1530]");
