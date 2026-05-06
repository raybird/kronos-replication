import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0507.1231]: Topological Connectivity & Entropy Resonance.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a Topological manifold.
 * 2. Connectivity = Degree of synchronization across causal features.
 * 3. Sovereignty is achieved through 'suturing' disjoint causal fragments.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static recursiveBias: number = 0;
  private static sPos: number = 0; 
  private static sNeg: number = 0; 
  private static reputationMatrix: Map<string, number> = new Map();
  private static topologyMap: number[][] = []; // Feature connectivity matrix

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
    if (Math.abs(macroMove) > atr * 7.5) return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Topological Suturing.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const current = history[history.length - 1];
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. TOPOLOGICAL CONNECTIVITY (New v1231) ---
    const getEff = (len: number) => {
        const win = history.slice(-len);
        const d = Math.max(...win.map(k => k.high)) - Math.min(...win.map(k => k.low));
        const p = win.reduce((s, k, i, arr) => i === 0 ? 0 : s + Math.abs(k.close - arr[i-1].close), 0);
        return d / (p || 1);
    };
    const e10 = getEff(10), e20 = getEff(20), e40 = getEff(40);
    const connectivity = (e10 * e20 * e40) / (Math.max(e10, e20, e40) || 1);

    // --- 2. MULTISCALE ENTROPY RESONANCE ---
    const volZ = (current.volume - history.slice(-20).reduce((s, k) => s + k.volume, 0) / 20) / (ta_std(history.slice(-20).map(k => k.volume)) || 1);
    const isResonant = connectivity > 0.45 && Math.abs(volZ) > 2.0;

    // --- 3. RECURSIVE PERSISTENCE & TOPOLOGY ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const persistence = Math.exp(-age / (110 * (connectivity + 0.2))); 
      t.causalDensity *= persistence;
      return t.causalDensity > 14.0; // V16 Threshold
    });
    tokens = [...this.tokenCache];

    // --- 4. TOPOLOGICAL CAUSAL SUTURE ---
    if (isResonant && connectivity > 0.6) {
      tokens.push({
        type: "TOPOLOGICAL_CAUSAL_SUTURE",
        confidence: 0.999,
        causalDensity: 50.0 // Peak Sovereignty V16
      });
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 3 ? 15.0 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0507.1231";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 70);
  }
}

function ta_std(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Topological Suturing [v26.0507.1231]");



















