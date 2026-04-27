import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0427.0830]: Bayesian Information Gain & Structural Imbalance.
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
    const prev = history[history.length - 2];
    const recent = history.slice(-20);
    
    const volAvg = history.slice(-50).reduce((a, b) => a + b.volume, 0) / 50;
    const rangeAvg = recent.reduce((sum, k) => sum + (k.high - k.low), 0) / 20;
    
    const body = Math.abs(current.close - current.open);
    const range = current.high - current.low;
    const upperTail = current.high - Math.max(current.open, current.close);
    const lowerTail = Math.min(current.open, current.close) - current.low;

    // --- 1. INSTITUTIONAL ABSORPTION ---
    if (current.volume > volAvg * 3.0 && body / range < 0.2) {
      const type = upperTail > lowerTail ? "ABSORPTION_SUPPLY" : "ABSORPTION_DEMAND";
      tokens.push({
        type,
        confidence: 0.96,
        causalDensity: 5.2
      });
    }

    // --- 2. STRUCTURAL IMBALANCE (Aggression) ---
    // High volume + High body-to-range ratio breaking local structure
    const localHigh = recent.slice(0, -1).reduce((m, k) => Math.max(m, k.high), 0);
    const localLow  = recent.slice(0, -1).reduce((m, k) => Math.min(m, k.low), Infinity);
    
    if (current.volume > volAvg * 1.8 && body / range > 0.8) {
      if (current.close > localHigh) {
        tokens.push({
          type: "IMBALANCE_BULL_BREAK",
          confidence: 0.92,
          causalDensity: 4.5
        });
      } else if (current.close < localLow) {
        tokens.push({
          type: "IMBALANCE_BEAR_BREAK",
          confidence: 0.92,
          causalDensity: 4.5
        });
      }
    }

    // --- 3. LIQUIDITY_VOID (Gravity Gap) ---
    if (body > rangeAvg * 2.8 && current.volume < volAvg * 1.0) {
      const type = current.close > current.open ? "LIQUIDITY_VOID_UP" : "LIQUIDITY_VOID_DOWN";
      tokens.push({
        type,
        confidence: 0.89,
        causalDensity: 3.8
      });
    }

    // --- 4. EXHAUSTION_PIN (Reversal Intent) ---
    if (range > rangeAvg * 2.2 && (upperTail > range * 0.65 || lowerTail > range * 0.65)) {
      tokens.push({
        type: `EXHAUSTION_PIN_${upperTail > lowerTail ? "BEAR" : "BULL"}`,
        confidence: 0.91,
        causalDensity: 4.8
      });
    }

    // --- 5. BAYESIAN SEMANTIC RE-CALIBRATION ---
    const synergy = tokens.length >= 2 ? 1.5 : 1.0;
    const regimePrior = (regime === MarketRegime.BullishTrending || regime === MarketRegime.BearishTrending) ? 1.4 : 
                        (regime === MarketRegime.HighVolatilityRange) ? 0.4 : 1.0;

    tokens.forEach(t => {
      t.causalDensity *= (synergy * regimePrior);
      // Half-life metadata based on token type
      const halfLife = t.type.includes("ABSORPTION") ? 40 : 
                       t.type.includes("VOID") ? 20 : 8;
      (t as any).halfLife = halfLife;
      (t as any).vYYMMDD_HHMM = "v26.0427.0830";
    });

    return tokens;
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Bayesian & Imbalance Mode [v26.0427.0830]");
