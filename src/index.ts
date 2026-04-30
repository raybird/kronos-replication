import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0430.2330]: Fractal Resonance & Multi-Scale Similarity.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Causal Density = (Fractal Resonance * Synergy) / (Memory Decay).
 * 3. Sovereignty is achieved through matching local action with macro-structural DNA.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static macroAnchorDNA: number[] = []; // Normalized high-volume structures

  /**
   * Identifies the current Market Regime with Hierarchical Entropy.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 60) return MarketRegime.LowVolatilityRange;

    const lookback60 = history.slice(-60);
    const ranges = lookback60.map(k => k.high - k.low);
    const atr = ranges.reduce((a, b) => a + b, 0) / 60;
    
    const macroMove = (history[history.length-1].close - history[history.length-60].close);
    const microMove = (history[history.length-1].close - history[history.length-10].close);
    
    const avgClose = lookback60.reduce((sum, k) => sum + k.close, 0) / 60;
    const volatility = Math.sqrt(lookback60.reduce((sum, k) => sum + Math.pow(k.close - avgClose, 2), 0) / 60) / avgClose;

    if (volatility > 0.09) return MarketRegime.HighVolatilityRange;
    if (macroMove > atr * 4.2 && microMove > 0) return MarketRegime.BullishTrending;
    if (macroMove < -atr * 4.2 && microMove < 0) return MarketRegime.BearishTrending;
    
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Fractal Resonance.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const recent = history.slice(-20);
    const rangeAvg = recent.reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. INTENT PERSISTENCE & DECAY ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const decayFactor = Math.exp(-age / 15); 
      t.causalDensity *= decayFactor;
      return t.causalDensity > 1.2;
    });
    tokens = [...this.tokenCache];

    // --- 2. FRACTAL RESONANCE (Original Spirit v2330) ---
    // Extract local structure (last 5 bars) and compare with macro breakouts
    const currentStructure = history.slice(-5).map(k => (k.close - k.open) / (k.high - k.low || 1));
    const histBreakouts = history.slice(-100, -10).filter(k => k.volume > volAvg * 2.5);
    
    let bestSimilarity = 0;
    if (histBreakouts.length > 0) {
      const macroDNA = history.slice(history.indexOf(histBreakouts[0]), history.indexOf(histBreakouts[0]) + 5).map(k => (k.close - k.open) / (k.high - k.low || 1));
      const distance = currentStructure.reduce((sum, val, i) => sum + Math.pow(val - (macroDNA[i] || 0), 2), 0);
      bestSimilarity = Math.exp(-Math.sqrt(distance)); // Higher for closer matches
    }

    if (bestSimilarity > 0.75) {
      tokens.push({
        type: `FRACTAL_RESONANCE`,
        confidence: 0.94,
        causalDensity: 9.5 * bestSimilarity
      });
    }

    // --- 3. LIQUIDITY VOID ---
    const body = Math.abs(current.close - current.open);
    if (body > rangeAvg * 3.2 && current.volume < volAvg * 1.0) {
      tokens.push({ type: `LIQUIDITY_VOID`, confidence: 0.97, causalDensity: 14.0 });
    }

    // --- 4. PATH CONSISTENCY ---
    const windows = [10, 25, 50];
    const consistent = windows.every(w => Math.sign(current.close - history[history.length - w].close) === Math.sign(current.close - history[history.length - 5].close));
    if (consistent) {
      tokens.push({ type: "PATH_CONSISTENCY", confidence: 0.90, causalDensity: 6.8 });
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 3 ? 2.0 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0430.2330";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 12);
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Fractal Resonance [v26.0430.2330]");



