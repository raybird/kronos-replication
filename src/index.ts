import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0430.2030]: Causal Memory Decay & Regime Divergence.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Intent Persistence = (Token Density * Volume Anchor) / (Time Decay).
 * 3. Sovereignty is achieved through hierarchical feature fusion.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];

  /**
   * Identifies the current Market Regime using Hierarchical Entropy.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 60) return MarketRegime.LowVolatilityRange;

    const lookback60 = history.slice(-60);
    const ranges = lookback60.map(k => k.high - k.low);
    const atr = ranges.reduce((a, b) => a + b, 0) / 60;
    
    // Macro vs Micro Divergence
    const macroMove = (history[history.length-1].close - history[history.length-60].close);
    const microMove = (history[history.length-1].close - history[history.length-10].close);
    
    const avgClose = lookback60.reduce((sum, k) => sum + k.close, 0) / 60;
    const volatility = Math.sqrt(lookback60.reduce((sum, k) => sum + Math.pow(k.close - avgClose, 2), 0) / 60) / avgClose;

    // Regime classification with Divergence Sensitivity
    if (volatility > 0.09) return MarketRegime.HighVolatilityRange;
    if (macroMove > atr * 4.0 && microMove > 0) return MarketRegime.BullishTrending;
    if (macroMove < -atr * 4.0 && microMove < 0) return MarketRegime.BearishTrending;
    
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Causal Decay & Multi-Scale Matching.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const recent = history.slice(-20);
    const rangeAvg = recent.reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. INTENT PERSISTENCE & DECAY (New v2030) ---
    // Inherited tokens from previous bars with volume-weighted decay
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const decayFactor = Math.exp(-age / 12); // Natural decay over ~12 bars
      t.causalDensity *= decayFactor;
      return t.causalDensity > 1.5; // Prune weak intents
    });
    tokens = [...this.tokenCache];

    // --- 2. LIQUIDITY VOID & IMBALANCE ---
    const body = Math.abs(current.close - current.open);
    if (body > rangeAvg * 3.0 && current.volume < volAvg * 1.1) {
      tokens.push({
        type: `LIQUIDITY_VOID`,
        confidence: 0.96,
        causalDensity: 12.0 // Peak Significance
      });
    }

    // --- 3. REGIME DIVERGENCE (Divergence Audit) ---
    const macroTrend = Math.sign(current.close - history[history.length - 60].close);
    const microTrend = Math.sign(current.close - history[history.length - 10].close);
    if (macroTrend !== microTrend && Math.abs(current.close - history[history.length - 10].close) > rangeAvg) {
      tokens.push({
        type: `REGIME_DIVERGENCE`,
        confidence: 0.85,
        causalDensity: 8.5
      });
    }

    // --- 4. PATH CONSISTENCY ---
    const windows = [5, 15, 30];
    const consistent = windows.every(w => Math.sign(current.close - history[history.length - w].close) === Math.sign(current.close - history[history.length - 5].close));
    if (consistent && Math.abs(current.close - history[history.length - 5].close) > rangeAvg * 0.8) {
      tokens.push({
        type: "PATH_CONSISTENCY",
        confidence: 0.92,
        causalDensity: 7.2
      });
    }

    // --- FINAL POST-PROCESSING & CACHING ---
    const synergy = tokens.length >= 3 ? 1.8 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0430.2030";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 10);
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Causal Memory Decay [v26.0430.2030]");


