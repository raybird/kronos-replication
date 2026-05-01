import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0502.0445]: Cross-Scale Harmonic & Structural Mastery.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Harmonic Confluence = Harmonic_Ratio(Micro_Energy, Macro_Gravity).
 * 3. Sovereignty is achieved through geometric alignment of intent across scales.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static recursiveBias: number = 0;
  private static cusumBuffer: number = 0;

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

    const lastReturn = returns[returns.length - 1];
    this.cusumBuffer = Math.max(0, this.cusumBuffer + (lastReturn - meanReturn) - (stdReturn * 0.5));
    
    const macroMove = (history[history.length-1].close - history[history.length-60].close);
    const ranges = lookback60.map(k => k.high - k.low);
    const atr = ranges.reduce((a, b) => a + b, 0) / 60;

    if (this.cusumBuffer > stdReturn * 5.0) {
       this.cusumBuffer = 0; 
       return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    }

    if (Math.abs(macroMove) > atr * 5.0) return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Harmonic Resonance.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. HARMONIC RESONANCE (New v0445) ---
    const microEnergy = (Math.abs(current.close - current.open) * current.volume) / (volAvg || 1);
    const macroEnergy = history.slice(-50).reduce((s, k) => s + (Math.abs(k.close - k.open) * k.volume), 0) / 50;
    const harmonicRatio = microEnergy / (macroEnergy || 1);

    // Capture "Golden Mean" resonance or extreme energy transfer
    if (harmonicRatio > 1.618 && harmonicRatio < 2.618) {
      tokens.push({
        type: "HARMONIC_RESONANCE_BULL",
        confidence: 0.96,
        causalDensity: 12.5
      });
    }

    // --- 2. STRUCTURAL BREAK ENTROPY ---
    const localEntropy = history.slice(-5).reduce((s, k, i, arr) => i === 0 ? s : s + Math.abs(k.close - arr[i-1].close), 0) / 5;
    const macroEntropy = history.slice(-60).reduce((s, k, i, arr) => i === 0 ? s : s + Math.abs(k.close - arr[i-1].close), 0) / 60;
    const entropyDrift = localEntropy / (macroEntropy || 1);

    if (entropyDrift > 3.0) {
      tokens.push({
        type: "STRUCTURAL_MASTER_BREAK",
        confidence: 0.99,
        causalDensity: 25.0 // Peak Sovereignty
      });
    }

    // --- 3. INTENT PERSISTENCE ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const persistence = Math.exp(-age / 30); // Deeper memory
      t.causalDensity *= persistence;
      return t.causalDensity > 2.0;
    });
    tokens = [...this.tokenCache, ...tokens];

    // --- 4. FRACTAL & RECURSIVE SYNTHESIS ---
    const currentMove = Math.sign(current.close - current.open);
    if (currentMove === Math.sign(this.recursiveBias) && Math.abs(this.recursiveBias) > 0.5) {
      tokens.push({ type: "RECURSIVE_SYNERGY", confidence: 0.94, causalDensity: 14.2 });
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 4 ? 3.5 : tokens.length >= 2 ? 1.8 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0502.0445";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 20);
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Harmonic Resonance [v26.0502.0445]");







