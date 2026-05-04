import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0504.0830]: Fractal Dimension & Liquidity Inducement.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Efficiency = Displacement / Total_Path_Length (Fractal D).
 * 3. Sovereignty is achieved through identifying low-entropy, low-fractal intent.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static recursiveBias: number = 0;
  private static sPos: number = 0; 
  private static sNeg: number = 0; 
  private static reputationMatrix: Map<string, number> = new Map();
  private static biasDivergenceCount: number = 0;

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
    if (Math.abs(macroMove) > atr * 6.0) return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Fractal Efficiency.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. FRACTAL DIMENSION AUDIT (New v0830) ---
    // Measure efficiency: (Max-Min) / Sum(Absolute Moves)
    const window20 = history.slice(-20);
    const displacement = Math.max(...window20.map(k => k.high)) - Math.min(...window20.map(k => k.low));
    const pathLength = window20.reduce((s, k, i, arr) => i === 0 ? 0 : s + Math.abs(k.close - arr[i-1].close), 0);
    const fractalEfficiency = displacement / (pathLength || 1); // Closer to 1 = trend, closer to 0 = noise

    // --- 2. LIQUIDITY INDUCEMENT SENSING ---
    const recentHighs = history.slice(-50).map(k => k.high);
    const liquidityMagnet = Math.max(...recentHighs);
    const proximity = (liquidityMagnet - current.close) / rangeAvg;
    const isInduced = proximity > 0 && proximity < 1.5; // High inducement toward buy-side liquidity

    // --- 3. RECURSIVE REPUTATION & PRUNING ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const persistence = Math.exp(-age / 75); 
      t.causalDensity *= (persistence * (fractalEfficiency > 0.4 ? 1.1 : 0.7));
      return t.causalDensity > 9.0; // V12 Threshold
    });
    tokens = [...this.tokenCache];

    // --- 4. FRACTAL EFFICIENCY MASTER ---
    if (fractalEfficiency > 0.65 && current.volume > volAvg * 1.2) {
      tokens.push({
        type: "FRACTAL_EFFICIENCY_MASTER",
        confidence: 0.98,
        causalDensity: 32.0 // Ultimate Sovereignty
      });
    }

    if (isInduced) {
      tokens.push({
        type: "LIQUIDITY_MAGNET_BULL",
        confidence: 0.85,
        causalDensity: 15.0
      });
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 3 ? 6.0 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0504.0830";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 45);
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Fractal Efficiency [v26.0504.0830]");















