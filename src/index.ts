import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0506.0830]: Spatio-Temporal Attention Gating.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a Spatio-Temporal manifold.
 * 2. Spatial Gating = Attention to price-level density (Congestion vs. Void).
 * 3. Temporal Gating = Non-linear decay based on structural significance.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static recursiveBias: number = 0;
  private static sPos: number = 0; 
  private static sNeg: number = 0; 
  private static reputationMatrix: Map<string, number> = new Map();
  private static priceCongestionMap: Map<number, number> = new Map(); // Price level -> Hit count

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
    if (Math.abs(macroMove) > atr * 6.5) return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Spatio-Temporal Gating.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const current = history[history.length - 1];
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. SPATIAL GATING (Price Density Attention) ---
    // Identify if current price is in a "Congestion Gate"
    const roundPrice = Math.round(current.close / (rangeAvg * 0.5)) * (rangeAvg * 0.5);
    const hits = (this.priceCongestionMap.get(roundPrice) || 0) + 1;
    this.priceCongestionMap.set(roundPrice, hits);
    const spatialGateFactor = hits > 15 ? 0.3 : 1.2; // Penalize choppy congestion, reward breakouts

    // --- 2. TEMPORAL ATTENTION (Fractal-based Decay) ---
    const window20 = history.slice(-20);
    const displacement = Math.max(...window20.map(k => k.high)) - Math.min(...window20.map(k => k.low));
    const pathLength = window20.reduce((s, k, i, arr) => i === 0 ? 0 : s + Math.abs(k.close - arr[i-1].close), 0);
    const fractalEfficiency = displacement / (pathLength || 1);

    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      // Non-linear temporal decay: High efficiency preserves tokens longer
      const persistence = Math.exp(-age / (80 * (fractalEfficiency + 0.5))); 
      t.causalDensity *= (persistence * spatialGateFactor);
      return t.causalDensity > 10.0; // V13 Threshold
    });
    tokens = [...this.tokenCache];

    // --- 3. SPATIO_TEMPORAL_GATE_MASTER ---
    if (fractalEfficiency > 0.7 && spatialGateFactor > 1.0) {
      tokens.push({
        type: "SPATIO_TEMPORAL_GATE_MASTER",
        confidence: 0.99,
        causalDensity: 35.0 // Absolute Sovereignty
      });
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 3 ? 7.0 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0506.0830";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 50);
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Spatio-Temporal Gating [v26.0506.0830]");
















