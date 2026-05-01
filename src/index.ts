import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0502.0430]: Structural Break & Entropy Drift.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Structural Stability = 1 / Σ|Entropy_Drift|.
 * 3. Sovereignty is achieved through identifying the precise moment of regime shift.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static recursiveBias: number = 0;
  private static cusumBuffer: number = 0; // Cumulative sum for structural break detection

  /**
   * Updates the internal recursive bias based on previous inference results.
   */
  public static setRecursiveBias(bias: number) {
    this.recursiveBias = bias;
  }

  /**
   * Identifies the current Market Regime using CUSUM Structural Break logic.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 60) return MarketRegime.LowVolatilityRange;

    const lookback60 = history.slice(-60);
    const returns = lookback60.map((k, i, arr) => i === 0 ? 0 : (k.close - arr[i-1].close) / arr[i-1].close);
    const meanReturn = returns.reduce((a, b) => a + b, 0) / 60;
    const stdReturn = Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / 60);

    // CUSUM Filter: Capturing structural breaks in mean return
    const lastReturn = returns[returns.length - 1];
    this.cusumBuffer = Math.max(0, this.cusumBuffer + (lastReturn - meanReturn) - (stdReturn * 0.5));
    
    const macroMove = (history[history.length-1].close - history[history.length-60].close);
    const ranges = lookback60.map(k => k.high - k.low);
    const atr = ranges.reduce((a, b) => a + b, 0) / 60;

    // Structural Break Trigger
    if (this.cusumBuffer > stdReturn * 5.0) {
       this.cusumBuffer = 0; // Reset after trigger
       return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    }

    if (Math.abs(macroMove) > atr * 5.0) return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Structural Break & Entropy Drift.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. ENTROPY DRIFT DETECTION ---
    const localEntropy = history.slice(-5).reduce((s, k, i, arr) => i === 0 ? s : s + Math.abs(k.close - arr[i-1].close), 0) / 5;
    const macroEntropy = history.slice(-60).reduce((s, k, i, arr) => i === 0 ? s : s + Math.abs(k.close - arr[i-1].close), 0) / 60;
    const entropyDrift = localEntropy / (macroEntropy || 1);

    if (entropyDrift > 2.8) {
      tokens.push({
        type: "STRUCTURAL_BREAK_ENTROPY",
        confidence: 0.98,
        causalDensity: 20.0 // Highest Tier: Regime Shift Signal
      });
    }

    // --- 2. INTENT PERSISTENCE & DECAY ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const persistence = Math.exp(-age / 25); 
      t.causalDensity *= persistence;
      return t.causalDensity > 1.5;
    });
    tokens = [...this.tokenCache, ...tokens];

    // --- 3. RECURSIVE ALIGNMENT ---
    const currentMove = Math.sign(current.close - current.open);
    if (currentMove === Math.sign(this.recursiveBias) && Math.abs(this.recursiveBias) > 0.4) {
      tokens.push({
        type: `RECURSIVE_CONFIRMATION`,
        confidence: 0.95,
        causalDensity: 12.0
      });
    }

    // --- 4. FRACTAL RESONANCE ---
    const currentStructure = history.slice(-5).map(k => (k.close - k.open) / (k.high - k.low || 1));
    const histBreakout = history.slice(-100, -10).find(k => k.volume > volAvg * 3.5);
    if (histBreakout) {
      const macroDNA = history.slice(history.indexOf(histBreakout), history.indexOf(histBreakout) + 5).map(k => (k.close - k.open) / (k.high - k.low || 1));
      const dist = Math.sqrt(currentStructure.reduce((s, v, i) => s + Math.pow(v - (macroDNA[i] || 0), 2), 0));
      if (dist < 0.28) {
        tokens.push({ type: "FRACTAL_RESONANCE", confidence: 0.97, causalDensity: 15.5 });
      }
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 3 ? 2.8 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0502.0430";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 18);
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Structural Break Entropy [v26.0502.0430]");






