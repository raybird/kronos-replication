import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0504.0430]: Information Bottleneck & Confidence Self-Correction.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Information Bottleneck = min(Entropy) s.t. max(Predictive_Power).
 * 3. Sovereignty is achieved through aggressive pruning of high-entropy noise.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static recursiveBias: number = 0;
  private static sPos: number = 0; 
  private static sNeg: number = 0; 
  private static reputationMatrix: Map<string, number> = new Map();
  private static biasDivergenceCount: number = 0; // Track bias vs actual divergence

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
    if (Math.abs(macroMove) > atr * 5.8) return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Bottleneck Pruning.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. CONFIDENCE SELF-CORRECTION (New v0430) ---
    const actualMove = Math.sign(current.close - current.open);
    if (this.recursiveBias !== 0 && actualMove !== Math.sign(this.recursiveBias)) {
      this.biasDivergenceCount++;
    } else {
      this.biasDivergenceCount = 0;
    }
    const correctionFactor = this.biasDivergenceCount >= 2 ? 0.6 : 1.0;

    // --- 2. INFORMATION BOTTLENECK PRUNING ---
    // Prune tokens with low signal-to-noise ratio (SNR)
    const snr = (Math.abs(current.close - current.open) / (rangeAvg || 1)) * correctionFactor;
    const isGated = snr < 0.25;

    // --- 3. RECURSIVE REPUTATION & PERSISTENCE ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const rep = this.reputationMatrix.get(t.type) || 1.0;
      const persistence = Math.exp(-age / (70 * rep)); 
      t.causalDensity *= (persistence * correctionFactor);
      return t.causalDensity > 8.0; // Higher Tier for V11
    });
    tokens = [...this.tokenCache];

    // --- 4. BOTTLENECK OPTIMIZED INTENT ---
    if (!isGated && Math.abs(current.close - current.open) > rangeAvg * 2.0) {
      tokens.push({
        type: "BOTTLENECK_OPTIMIZED_INTENT",
        confidence: 0.96 * correctionFactor,
        causalDensity: 28.0 // Peak Efficiency
      });
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 3 ? 5.0 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0504.0430";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 40);
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Information Bottleneck [v26.0504.0430]");














