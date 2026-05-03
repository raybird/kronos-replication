import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0503.0830]: Volatility Clustering & Causal Persistence.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Causal Persistence = Autocorrelation(Volatility) * Evidence_Density.
 * 3. Sovereignty is achieved through identifying the clusters of high-intent energy.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static recursiveBias: number = 0;
  private static sPos: number = 0; 
  private static sNeg: number = 0; 

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
    if (Math.abs(macroMove) > atr * 5.0) return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Volatility Clustering.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. VOLATILITY CLUSTERING CAUSALITY (New v0830) ---
    // Identify if current volatility spike is part of a persistent cluster (GARCH-like)
    const recentAtrs = history.slice(-20).map((k, i, arr) => i === 0 ? 0 : Math.abs(k.high - k.low));
    const volVolatility = Math.sqrt(recentAtrs.reduce((s, v) => s + Math.pow(v - rangeAvg, 2), 0) / 20);
    const volPersistence = (rangeAvg / (volVolatility || 1));

    if (volPersistence > 2.0 && Math.abs(current.close - current.open) > rangeAvg * 1.5) {
      tokens.push({
        type: "VOLATILITY_PERSISTENCE",
        confidence: 0.94,
        causalDensity: 16.5 // High stability multiplier
      });
    }

    // --- 2. ASYMMETRIC INFORMATION TRANSFER (AIT) ---
    const priceAccel = (current.close - current.open) / (history[history.length-2].close - history[history.length-2].open || 1);
    const volumeAccel = current.volume / (history[history.length-2].volume || 1);
    const aitScore = volumeAccel / (Math.abs(priceAccel) + 0.1);

    if (aitScore > 2.8 && current.volume > volAvg * 1.6) {
      tokens.push({
        type: "ASYMMETRIC_INFO_TRANSFER",
        confidence: 0.98,
        causalDensity: 24.0
      });
    }

    // --- 3. INTENT PERSISTENCE ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const persistence = Math.exp(-age / 55); 
      t.causalDensity *= persistence;
      return t.causalDensity > 5.0;
    });
    tokens = [...this.tokenCache, ...tokens];

    // --- 4. CAUSAL ENTANGLEMENT (Non-linear Synergy) ---
    const hasAIT = tokens.some(t => t.type === "ASYMMETRIC_INFO_TRANSFER");
    const hasPersistence = tokens.some(t => t.type === "VOLATILITY_PERSISTENCE");
    if (hasAIT && hasPersistence) {
      tokens.push({
        type: "CAUSAL_ENTANGLEMENT_MASTER",
        confidence: 1.0,
        causalDensity: 45.0 // Ultimate Sovereignty: AIT within a Volatility Cluster
      });
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 3 ? 3.5 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0503.0830";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 25);
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Volatility Clustering [v26.0503.0830]");











