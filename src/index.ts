import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0507.0831]: Fractal Causal Entropy & Dynamic Scaling.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a Multiscale Fractal manifold.
 * 2. Causal Weight = TE / (Fractal_Dimension * Scale_Entropy).
 * 3. Sovereignty is achieved through distilling cross-scale structural invariant intents.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static recursiveBias: number = 0;
  private static sPos: number = 0; 
  private static sNeg: number = 0; 
  private static reputationMatrix: Map<string, number> = new Map();
  private static scaleConsistencyMap: Map<string, number> = new Map();

  public static setRecursiveBias(bias: number) {
    this.recursiveBias = bias;
  }

  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 60) return MarketRegime.LowVolatilityRange;
    const lookback60 = history.slice(-60);
    const returns = lookback60.map((k, i, arr) => i === 0 ? 0 : (k.close - arr[i-1].close) / arr[i-1].close);
    const meanReturn = returns.reduce((a, b) => a + b, 0) / 60;
    const stdReturn = Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / 60) || 0.001;

    const lastReturn = returns[returns.length - 1];
    const diff = lastReturn - meanReturn;
    this.sPos = Math.max(0, this.sPos + diff - (stdReturn * 0.5));
    this.sNeg = Math.min(0, this.sNeg + diff + (stdReturn * 0.5));
    
    const threshold = stdReturn * 5.0;
    const isBreak = this.sPos > threshold || Math.abs(this.sNeg) > threshold;
    const macroMove = (history[history.length-1].close - history[history.length-60].close);
    const atr = lookback60.reduce((s, k) => s + (k.high - k.low), 0) / 60;

    if (isBreak) {
       this.sPos = 0; this.sNeg = 0; 
       return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    }
    if (Math.abs(macroMove) > atr * 7.8) return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Fractal Causal Weighting.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const current = history[history.length - 1];
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. MULTISCALE FRACTAL AUDIT (New v0831) ---
    const getFractalD = (len: number) => {
        const win = history.slice(-len);
        const displacement = Math.abs(win[win.length-1].close - win[0].close);
        const pathLength = win.reduce((s, k, i, arr) => i === 0 ? 0 : s + Math.abs(k.close - arr[i-1].close), 0);
        return pathLength / (displacement || 1); // Approximation of Fractal D
    };
    const fd10 = getFractalD(10), fd20 = getFractalD(20), fd40 = getFractalD(40);
    const scaleConsistency = 1.0 / (Math.abs(fd10 - fd20) + Math.abs(fd20 - fd40) + 0.1);

    // --- 2. DYNAMIC CAUSAL SCALING ---
    const volZ = (current.volume - history.slice(-30).reduce((s, k) => s + k.volume, 0) / 30) / (ta_std(history.slice(-30).map(k => k.volume)) || 1);
    const entropyWeight = scaleConsistency * (Math.abs(volZ) > 1.5 ? 1.5 : 0.8);

    // --- 3. RECURSIVE REPUTATION & DISTILLATION ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const persistence = Math.exp(-age / (120 * (scaleConsistency + 0.2))); 
      t.causalDensity *= persistence;
      return t.causalDensity > 16.0; // V17 Threshold
    });
    tokens = [...this.tokenCache];

    // --- 4. FRACTAL CAUSAL SYNTROPY ---
    if (scaleConsistency > 4.0 && Math.abs(volZ) > 2.5) {
      tokens.push({
        type: "FRACTAL_CAUSAL_SYNTROPY",
        confidence: 0.9995,
        causalDensity: 55.0 // Peak Sovereignty V17
      });
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 3 ? 18.0 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0507.0831";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy * entropyWeight;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 80);
  }
}

function ta_std(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Fractal Causal Entropy [v26.0507.0831]");




















