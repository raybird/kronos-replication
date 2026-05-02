import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0502.1130]: Self-Attention Gating & Causal Entropy Routing.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Self-Attention = Softmax(Query * Key) * Value (Simplified).
 * 3. Sovereignty is achieved through routing only the highest-attention causal paths.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static recursiveBias: number = 0;
  private static cusumBuffer: number = 0;

  /**
   * Updates the internal recursive bias based on previous inference results.
   */
  public static setRecursiveBias(bias: number) {
    this.recursiveBias = bias;
  }

  /**
   * Identifies the current Market Regime using CUSUM Structural Break logic.
   */
  public static identifyRegime(history: Kline[]): MarketRegime {
    if (history.length < 60) return MarketRegime.LowVolatilityRange;

    const lookback60 = history.slice(-60);
    const returns = lookback60.map((k, i, arr) => i === 0 ? 0 : (k.close - arr[i-1].close) / arr[i-1].close);
    const meanReturn = returns.reduce((a, b) => a + b, 0) / 60;
    const stdReturn = Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / 60);

    const lastReturn = returns[returns.length - 1];
    this.cusumBuffer = Math.max(0, this.cusumBuffer + (lastReturn - meanReturn) - (stdReturn * 0.5));
    
    const macroMove = (history[history.length-1].close - history[history.length-60].close);
    const ranges = lookback60.map(k => k.high - k.low);
    const atr = ranges.reduce((a, b) => a + b, 0) / 60;

    if (this.cusumBuffer > stdReturn * 5.0) {
       this.cusumBuffer = 0; 
       return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    }

    if (Math.abs(macroMove) > atr * 5.0) return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Self-Attention Gating.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const regime = this.identifyRegime(history);
    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. SELF-ATTENTION GATING (New v1130) ---
    // Calculate attention score based on momentum vs volatility
    const momentum = Math.abs(current.close - current.open);
    const attentionScore = (momentum / (rangeAvg || 1)) * (current.volume / (volAvg || 1));
    const attentionGate = Math.max(0.1, Math.min(1.0, Math.exp(attentionScore - 2.0))); // Softmax-like squash

    // --- 2. HARMONIC RESONANCE ---
    const microEnergy = momentum * current.volume / (volAvg || 1);
    const macroEnergy = history.slice(-50).reduce((s, k) => s + (Math.abs(k.close - k.open) * k.volume), 0) / 50;
    const harmonicRatio = microEnergy / (macroEnergy || 1);

    if (harmonicRatio > 1.618 && harmonicRatio < 2.618) {
      tokens.push({
        type: "HARMONIC_RESONANCE_BULL",
        confidence: 0.96 * attentionGate,
        causalDensity: 12.5 * attentionGate
      });
    }

    // --- 3. STRUCTURAL BREAK ENTROPY ---
    const localEntropy = history.slice(-5).reduce((s, k, i, arr) => i === 0 ? s : s + Math.abs(k.close - arr[i-1].close), 0) / 5;
    const macroEntropy = history.slice(-60).reduce((s, k, i, arr) => i === 0 ? s : s + Math.abs(k.close - arr[i-1].close), 0) / 60;
    const entropyDrift = localEntropy / (macroEntropy || 1);

    if (entropyDrift > 3.0) {
      tokens.push({
        type: "STRUCTURAL_MASTER_BREAK",
        confidence: 0.99 * attentionGate,
        causalDensity: 25.0 * attentionGate
      });
    }

    // --- 4. INTENT PERSISTENCE & SELF-CORRECTION ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const persistence = Math.exp(-age / 35); 
      t.causalDensity *= persistence;
      return t.causalDensity > 2.5; // Stricter cache retention
    });
    tokens = [...this.tokenCache, ...tokens];

    // --- 5. FRACTAL & CAUSAL ENTROPY ROUTING ---
    const currentMove = Math.sign(current.close - current.open);
    if (currentMove === Math.sign(this.recursiveBias) && Math.abs(this.recursiveBias) > 0.5) {
      tokens.push({ type: "CAUSAL_ENTROPY_ROUTING", confidence: 0.95, causalDensity: 16.0 * attentionGate });
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 4 ? 3.8 : tokens.length >= 2 ? 1.9 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0502.1130";
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
console.log("Kronos Replication Engine Evolved: Self-Attention Gating [v26.0502.1130]");







