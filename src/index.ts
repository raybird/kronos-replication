import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0503.1530]: Sentiment Entropy & Non-linear Energy Transfer.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Energy Transfer = (Momentum / Entropy) * sqrt(Volume_Stability).
 * 3. Sovereignty is achieved through identifying ordered intent in chaotic regimes.
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
   * Main tokenization logic implementing Sentiment Entropy & Energy Transfer.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. SENTIMENT ENTROPY AUDIT (New v1530) ---
    // Measure the "orderliness" of price action relative to volume
    const localReturns = history.slice(-10).map(k => Math.abs(k.close - k.open) / (k.high - k.low || 1));
    const entropy = localReturns.reduce((s, r) => s + (r * Math.log(r + 0.001)), 0) / -10;
    
    if (entropy < 0.18 && Math.abs(current.close - current.open) > rangeAvg * 1.2) {
      tokens.push({
        type: "SENTIMENT_ORDER_BULL",
        confidence: 0.95,
        causalDensity: 14.5 // Intent is highly ordered and efficient
      });
    }

    // --- 2. NON-LINEAR ENERGY TRANSFER ---
    const momentum = Math.abs(current.close - current.open);
    const volumeEfficiency = momentum / (current.volume / volAvg || 1);
    if (volumeEfficiency > rangeAvg * 2.8 && current.volume < volAvg * 1.2) {
      tokens.push({
        type: "ENERGY_ACCUMULATION",
        confidence: 0.92,
        causalDensity: 19.0 // Potential energy stored for next displacement
      });
    }

    // --- 3. VOLATILITY PERSISTENCE & INTENT PERSISTENCE ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const persistence = Math.exp(-age / 60); 
      t.causalDensity *= persistence;
      return t.causalDensity > 6.0; // Higher survival threshold for V9
    });
    tokens = [...this.tokenCache, ...tokens];

    // --- 4. ULTIMATE CAUSAL ENTANGLEMENT ---
    const hasOrder = tokens.some(t => t.type === "SENTIMENT_ORDER_BULL");
    const hasEnergy = tokens.some(t => t.type === "ENERGY_ACCUMULATION");
    if (hasOrder && hasEnergy) {
      tokens.push({
        type: "CAUSAL_ENTANGLEMENT_MASTER",
        confidence: 1.0,
        causalDensity: 50.0 // Peak Sovereignty: Ordered energy accumulation
      });
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 3 ? 4.0 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0503.1530";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 30);
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Sentiment Order [v26.0503.1530]");












