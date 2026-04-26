import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0426.2035]: Hierarchical Quantization & Institutional Footprint.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language.
 * 2. Tokens must capture 'Intent' (Liquidity/Absorption) over 'Patterns'.
 * 3. Causal Density = Information Content * Market Context Alignment.
 */
export class KronosTokenizer {
  /**
   * Identifies the current Market Regime with Entropy awareness.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 30) return MarketRegime.LowVolatilityRange;

    const last = history[history.length - 1];
    const first = history[history.length - 30];
    
    const move = (last.close - first.close) / first.close;
    const avgClose = history.reduce((sum, k) => sum + k.close, 0) / history.length;
    const variance = history.reduce((sum, k) => sum + Math.pow(k.close - avgClose, 2), 0) / history.length;
    const volatility = Math.sqrt(variance) / avgClose;

    // High entropy (Chaos) detection
    if (volatility > 0.065) return MarketRegime.HighVolatilityRange;
    
    // Trend alignment
    if (move > 0.035) return MarketRegime.BullishTrending;
    if (move < -0.035) return MarketRegime.BearishTrending;
    
    // Volume exhaustion check
    const volMA = history.slice(-30).reduce((a, b) => a + b.volume, 0) / 30;
    if (last.volume > volMA * 4.5) return MarketRegime.Exhaustion;

    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Institutional Footprint.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    const tokens: FinancialToken[] = [];
    if (history.length < 30) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const recent = history.slice(-30);
    const volAvg = recent.reduce((a, b) => a + b.volume, 0) / 30;
    const volStd = Math.sqrt(recent.reduce((s, k) => s + Math.pow(k.volume - volAvg, 2), 0) / 30);
    const avgRange = recent.reduce((sum, k) => sum + (k.high - k.low), 0) / 30;
    
    const bodySize = Math.abs(current.close - current.open);
    const totalSize = current.high - current.low;
    const upperWick = current.high - Math.max(current.open, current.close);
    const lowerWick = Math.min(current.open, current.close) - current.low;

    // --- 1. INSTITUTIONAL ABSORPTION (Spirit of Kronos) ---
    // High volume at extremes with minimal price progress = Absorption
    const isHighVol = current.volume > volAvg + 1.5 * volStd;
    if (isHighVol && (upperWick > bodySize * 2 || lowerWick > bodySize * 2)) {
      const type = upperWick > lowerWick ? "ABSORPTION_SUPPLY" : "ABSORPTION_DEMAND";
      tokens.push({
        type,
        confidence: 0.94,
        causalDensity: 4.2 // High predictive value for reversal/sideways
      });
    }

    // --- 2. ACCUMULATION COMPRESSION (VCP Spirit) ---
    // Volatility shrinking + Volume dry-up near structural pivots
    const recentHigh = recent.slice(0, -1).reduce((m, k) => Math.max(m, k.high), 0);
    const volCompression = totalSize < avgRange * 0.4 && current.volume < volAvg * 0.6;
    if (volCompression && Math.abs(current.close - recentHigh) < avgRange * 0.2) {
      tokens.push({
        type: "ACCUMULATION_COMPRESSION_BULL",
        confidence: 0.85,
        causalDensity: 3.1
      });
    }

    // --- 3. IMBALANCE_BREAKOUT (Polarization) ---
    // High volume, high body-to-wick ratio breaking levels
    if (isHighVol && bodySize / totalSize > 0.85) {
      const direction = current.close > current.open ? "BULL" : "BEAR";
      tokens.push({
        type: `IMBALANCE_BREAKOUT_${direction}`,
        confidence: 0.91,
        causalDensity: 3.8
      });
    }

    // --- 4. LIQUIDITY_RUN (Stop Hunting) ---
    // Price pierces recent extreme then reverses sharply within the same bar
    const prevLow = recent.slice(-5, -1).reduce((m, k) => Math.min(m, k.low), Infinity);
    if (current.low < prevLow && current.close > current.open && lowerWick > totalSize * 0.6) {
      tokens.push({
        type: "LIQUIDITY_RUN_REVERSAL_BULL",
        confidence: 0.89,
        causalDensity: 4.5
      });
    }

    // --- 5. HIERARCHICAL QUANTIZATION & CAUSAL RE-CALIBRATION ---
    // Bayesian adjustment based on Regime and Synergy
    const regimeMultiplier = 
      (regime === MarketRegime.BullishTrending) ? 1.4 :
      (regime === MarketRegime.BearishTrending) ? 1.4 :
      (regime === MarketRegime.HighVolatilityRange) ? 0.6 : 1.0;

    tokens.forEach(t => {
      // Synergy bonus: multiple tokens confirming intent
      const synergy = tokens.length > 1 ? 1.25 : 1.0;
      t.causalDensity *= (regimeMultiplier * synergy);
      
      // Metadata injection (Spiritual Metadata)
      (t as any).intent = t.type.includes("ABSORPTION") ? "STALLING" : 
                          t.type.includes("IMBALANCE") ? "AGGRESSION" : "NEUTRAL";
    });

    return tokens;
  }
}

// Execution Trace
const version = "v26.0426.2035";
console.log(`[Kronos] Spiritual Inheritance Engine Active: ${version}`);
