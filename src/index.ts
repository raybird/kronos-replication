import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0501.0830]: Cumulative Imbalance & Entropy Filtering.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Causal Momentum = Σ(Imbalance * Volume Weight) / Entropy.
 * 3. Sovereignty is achieved through capturing the non-linear transfer of energy.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static imbalanceBuffer: number[] = []; // Buffer for sequential body/volume ratios

  /**
   * Identifies the current Market Regime using Volatility Entropy.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 60) return MarketRegime.LowVolatilityRange;

    const lookback60 = history.slice(-60);
    const avgClose = lookback60.reduce((sum, k) => sum + k.close, 0) / 60;
    
    // Entropy: Distribution of relative price moves
    const returns = lookback60.map((k, i, arr) => i === 0 ? 0 : Math.abs(k.close - arr[i-1].close) / (k.high - k.low || 1));
    const entropy = returns.reduce((a, b) => a + b, 0) / 60;

    const macroMove = (history[history.length-1].close - history[history.length-60].close);
    const ranges = lookback60.map(k => k.high - k.low);
    const atr = ranges.reduce((a, b) => a + b, 0) / 60;

    // Prune low-entropy "fake noise" zones
    if (entropy < 0.12) return MarketRegime.LowVolatilityRange;
    if (entropy > 0.45) return MarketRegime.HighVolatilityRange;

    if (macroMove > atr * 4.5) return MarketRegime.BullishTrending;
    if (macroMove < -atr * 4.5) return MarketRegime.BearishTrending;
    
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Cumulative Imbalance Matrix.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const recent = history.slice(-20);
    const rangeAvg = recent.reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. INTENT PERSISTENCE & DECAY ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const decayFactor = Math.exp(-age / 18); // Slightly longer persistence
      t.causalDensity *= decayFactor;
      return t.causalDensity > 1.0;
    });
    tokens = [...this.tokenCache];

    // --- 2. CUMULATIVE IMBALANCE MATRIX (Spirit v5.1) ---
    const body = Math.abs(current.close - current.open);
    const imb = body / (current.volume / volAvg || 1);
    this.imbalanceBuffer.push(imb);
    if (this.imbalanceBuffer.length > 5) this.imbalanceBuffer.shift();

    const avgImbalance = this.imbalanceBuffer.reduce((a, b) => a + b, 0) / 5;
    if (avgImbalance > rangeAvg * 2.5 && tokens.filter(t => t.type === "CUMULATIVE_IMBALANCE").length === 0) {
      tokens.push({
        type: `CUMULATIVE_IMBALANCE`,
        confidence: 0.98,
        causalDensity: 15.0 // New Tier 1 Signal
      });
    }

    // --- 3. FRACTAL RESONANCE CHECK ---
    const currentStructure = history.slice(-5).map(k => (k.close - k.open) / (k.high - k.low || 1));
    const histBreakout = history.slice(-100, -10).find(k => k.volume > volAvg * 3.0);
    if (histBreakout) {
      const macroDNA = history.slice(history.indexOf(histBreakout), history.indexOf(histBreakout) + 5).map(k => (k.close - k.open) / (k.high - k.low || 1));
      const dist = Math.sqrt(currentStructure.reduce((s, v, i) => s + Math.pow(v - (macroDNA[i] || 0), 2), 0));
      if (dist < 0.35) {
        tokens.push({ type: "FRACTAL_RESONANCE", confidence: 0.95, causalDensity: 11.2 });
      }
    }

    // --- 4. ENTROPY FILTER ---
    if (regime === MarketRegime.LowVolatilityRange) {
      tokens.push({ type: "ENTROPY_PRUNING", confidence: 0.88, causalDensity: -5.0 }); // Negative weight to suppress noise
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 3 ? 2.2 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0501.0830";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 15);
  }
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Cumulative Imbalance [v26.0501.0830]");




