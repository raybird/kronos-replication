import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0506.1532]: Phase-Space Trajectory & Causal Gravity.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a Phase-Space manifold (Price, Volatility).
 * 2. Gravity = Multi-scale Fractal Resonance.
 * 3. Sovereignty is achieved through detecting equilibrium breaks in the manifold.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static recursiveBias: number = 0;
  private static sPos: number = 0; 
  private static sNeg: number = 0; 
  private static reputationMatrix: Map<string, number> = new Map();
  private static manifoldEquilibrium: number = 0; // Baseline for Phase-Space

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
    if (Math.abs(macroMove) > atr * 6.8) return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Phase-Space Audit.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. PHASE-SPACE TRAJECTORY (New v1532) ---
    // Measure: Displacement relative to realized volatility (SNR of the manifold)
    const returns10 = history.slice(-10).map((k, i, arr) => i === 0 ? 0 : Math.abs(k.close - arr[i-1].close));
    const localVolatility = returns10.reduce((a, b) => a + b, 0) / 10;
    const trajectoryDisplacement = Math.abs(current.close - history[history.length-10].close);
    const phaseSpaceSovereignty = trajectoryDisplacement / (localVolatility * 3.5 || 1);

    // --- 2. CAUSAL GRAVITY WAVE (Multi-scale Resonance) ---
    const calculateEfficiency = (len: number) => {
        const win = history.slice(-len);
        const d = Math.max(...win.map(k => k.high)) - Math.min(...win.map(k => k.low));
        const p = win.reduce((s, k, i, arr) => i === 0 ? 0 : s + Math.abs(k.close - arr[i-1].close), 0);
        return d / (p || 1);
    };
    const resonance = (calculateEfficiency(10) + calculateEfficiency(20) + calculateEfficiency(40)) / 3.0;

    // --- 3. RECURSIVE PERSISTENCE & EVOLUTION ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const persistence = Math.exp(-age / (85 * (resonance + 0.2))); 
      t.causalDensity *= persistence;
      return t.causalDensity > 11.0; // V14 Threshold
    });
    tokens = [...this.tokenCache];

    // --- 4. PHASE-SPACE EQUILIBRIUM BREAK ---
    if (phaseSpaceSovereignty > 1.25 && resonance > 0.6) {
      tokens.push({
        type: "PHASE_SPACE_EQUILIBRIUM_BREAK",
        confidence: 0.99,
        causalDensity: 38.0 // Peak Sovereignty V14
      });
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 3 ? 8.0 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0506.1532";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 55);
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Phase-Space Trajectory [v26.0506.1532]");

















