import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0501.2030]: Recursive Intent & DSR Causal Penalty.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Intent = f(CurrentAction, RecursiveContext) * DSR_Factor.
 * 3. Sovereignty is achieved through self-correcting semantic feedback loops.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static recursiveBias: number = 0; // Feedback from Inference Engine

  /**
   * Updates the internal recursive bias based on previous inference results.
   */
  public static setRecursiveBias(bias: number) {
    this.recursiveBias = bias;
  }

  /**
   * Identifies the current Market Regime using DSR-Aware Entropy.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 60) return MarketRegime.LowVolatilityRange;

    const lookback60 = history.slice(-60);
    const returns = lookback60.map((k, i, arr) => i === 0 ? 0 : Math.abs(k.close - arr[i-1].close) / (k.high - k.low || 1));
    const entropy = returns.reduce((a, b) => a + b, 0) / 60;
    
    const macroMove = (history[history.length-1].close - history[history.length-60].close);
    const ranges = lookback60.map(k => k.high - k.low);
    const atr = ranges.reduce((a, b) => a + b, 0) / 60;

    // DSR conscious regime: Prune environments where random SR inflation is likely
    if (entropy < 0.15 && Math.abs(this.recursiveBias) < 0.2) return MarketRegime.LowVolatilityRange;
    if (entropy > 0.48) return MarketRegime.HighVolatilityRange;

    if (macroMove > atr * 4.8) return MarketRegime.BullishTrending;
    if (macroMove < -atr * 4.8) return MarketRegime.BearishTrending;
    
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Recursive Alignment.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. RECURSIVE INTENT ALIGNMENT (New v2030) ---
    // Amplify current signal if it aligns with recursive context
    const currentMove = Math.sign(current.close - current.open);
    const isAlignedWithHistory = currentMove === Math.sign(this.recursiveBias);

    // --- 2. INTENT PERSISTENCE & DSR PENALTY ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const dsrFactor = Math.exp(-age / 20); // DSR-based decay
      t.causalDensity *= dsrFactor;
      return t.causalDensity > 1.2;
    });
    tokens = [...this.tokenCache];

    // --- 3. CUMULATIVE IMBALANCE & RECURSIVE BOOST ---
    const body = Math.abs(current.close - current.open);
    if (body > rangeAvg * 3.5 && current.volume < volAvg * 1.0) {
      const boost = isAlignedWithHistory ? 1.5 : 0.8;
      tokens.push({
        type: `RECURSIVE_IMBALANCE`,
        confidence: 0.97,
        causalDensity: 18.0 * boost // Peak Intent
      });
    }

    // --- 4. FRACTAL RESONANCE ---
    const currentStructure = history.slice(-5).map(k => (k.close - k.open) / (k.high - k.low || 1));
    const histBreakout = history.slice(-100, -10).find(k => k.volume > volAvg * 3.2);
    if (histBreakout) {
      const macroDNA = history.slice(history.indexOf(histBreakout), history.indexOf(histBreakout) + 5).map(k => (k.close - k.open) / (k.high - k.low || 1));
      const dist = Math.sqrt(currentStructure.reduce((s, v, i) => s + Math.pow(v - (macroDNA[i] || 0), 2), 0));
      if (dist < 0.30) {
        tokens.push({ type: "FRACTAL_RESONANCE", confidence: 0.96, causalDensity: 12.5 });
      }
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 3 ? 2.5 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0501.2030";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 15);
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Recursive Intent [v26.0501.2030]");





