import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0502.2030]: Sharpe Ratio Deflation & Statistical Gating.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Statistical Purity = (Raw_Density * DSR_Adjustment) / sqrt(Time).
 * 3. Sovereignty is achieved through pruning 'Luck' from Causal Intent.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static recursiveBias: number = 0;
  private static sPos: number = 0; 
  private static sNeg: number = 0; 

  /**
   * Updates the internal recursive bias based on previous inference results.
   */
  public static setRecursiveBias(bias: number) {
    this.recursiveBias = bias;
  }

  /**
   * Identifies the current Market Regime using Symmetric CUSUM logic.
   */
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
   * Main tokenization logic implementing Statistical Gating.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. SHARPE RATIO DEFLATION GATE (Curiosity Research v26.0501) ---
    // Prune tokens that appear in 'too easy' (high SR, low entropy) environments
    const recentReturns = history.slice(-20).map((k, i, arr) => i === 0 ? 0 : (k.close - arr[i-1].close) / arr[i-1].close);
    const avgRet = recentReturns.reduce((a, b) => a + b, 0) / 20;
    const stdRet = Math.sqrt(recentReturns.reduce((a, b) => a + Math.pow(b - avgRet, 2), 0) / 20) || 0.001;
    const localSR = (avgRet / stdRet) * Math.sqrt(252); // Annualized

    const localEntropy = history.slice(-5).reduce((s, k, i, arr) => i === 0 ? s : s + Math.abs(k.close - arr[i-1].close), 0) / 5;
    const macroEntropy = history.slice(-60).reduce((s, k, i, arr) => i === 0 ? s : s + Math.abs(k.close - arr[i-1].close), 0) / 60;
    const entropyRatio = localEntropy / (macroEntropy || 1);

    // If SR is abnormally high while entropy is low, it's likely luck.
    const dsrDeflator = (localSR > 4.5 && entropyRatio < 1.2) ? 0.4 : 1.0;

    // --- 2. INTENT PERSISTENCE ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const persistence = Math.exp(-age / 45); 
      t.causalDensity *= (persistence * dsrDeflator);
      return t.causalDensity > 3.5;
    });
    tokens = [...this.tokenCache];

    // --- 3. CUSUM & HARMONIC RESONANCE ---
    const isCusumActive = this.sPos === 0 && this.sNeg === 0;
    if (isCusumActive && Math.abs(current.close - current.open) > rangeAvg * 1.8) {
      tokens.push({
        type: "STRUCTURAL_REGIME_BREAK",
        confidence: 1.0,
        causalDensity: 35.0 * dsrDeflator // Peak Intent
      });
    }

    const microEnergy = Math.abs(current.close - current.open) * current.volume / (volAvg || 1);
    const macroEnergy = history.slice(-50).reduce((s, k) => s + (Math.abs(k.close - k.open) * k.volume), 0) / 50;
    const harmonicRatio = microEnergy / (macroEnergy || 1);

    if (harmonicRatio > 1.618 && harmonicRatio < 2.618) {
      tokens.push({
        type: "HARMONIC_RESONANCE",
        confidence: 0.96 * dsrDeflator,
        causalDensity: 18.0 * dsrDeflator
      });
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 4 ? 4.5 : tokens.length >= 2 ? 2.5 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0502.2030";
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
console.log("Kronos Replication Engine Evolved: SR Deflation Gating [v26.0502.2030]");









