import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0508.0831]: Sovereign Resonance & Causal Coherence.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a Coherent Field of causal intents.
 * 2. Resonance = Mutual information maximization across price/vol manifolds.
 * 3. Sovereignty is achieved through identifying coherent phase transitions in the field.
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static recursiveBias: number = 0;
  private static sPos: number = 0; 
  private static sNeg: number = 0; 
  private static reputationMatrix: Map<string, number> = new Map();
  private static fieldCoherenceHistory: number[] = [];

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
    if (Math.abs(macroMove) > atr * 8.2) return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Sovereign Resonance Audit.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const current = history[history.length - 1];
    const volAvg = history.slice(-100).reduce((a, b) => a + b.volume, 0) / 100;
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. FIELD COHERENCE AUDIT (New v0831) ---
    const getFractalD = (len: number) => {
        const win = history.slice(-len);
        const displacement = Math.abs(win[win.length-1].close - win[0].close);
        const pathLength = win.reduce((s, k, i, arr) => i === 0 ? 0 : s + Math.abs(k.close - arr[i-1].close), 0);
        return pathLength / (displacement || 1);
    };
    const fd20 = getFractalD(20);
    const volZ = (current.volume - history.slice(-20).reduce((s, k) => s + k.volume, 0) / 20) / (ta_std(history.slice(-20).map(k => k.volume)) || 1);
    
    const coherence = (1.0 / (fd20 + 0.1)) * (Math.abs(volZ) > 1.2 ? 1.4 : 0.5);
    this.fieldCoherenceHistory.push(coherence);
    if (this.fieldCoherenceHistory.length > 40) this.fieldCoherenceHistory.shift();

    // --- 2. CAUSAL COHERENCE SENSING ---
    const isCoherent = coherence > 1.8 && (coherence > (this.fieldCoherenceHistory[0] || 0));

    // --- 3. RECURSIVE PERSISTENCE & COHERENCE ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const persistence = Math.exp(-age / (140 * (coherence + 0.2))); 
      t.causalDensity *= persistence;
      return t.causalDensity > 20.0; // V18 Threshold
    });
    tokens = [...this.tokenCache];

    // --- 4. SOVEREIGN RESONANCE FIELD MASTER ---
    if (isCoherent && Math.abs(volZ) > 3.5) {
      tokens.push({
        type: "SOVEREIGN_RESONANCE_FIELD_MASTER",
        confidence: 0.9999,
        causalDensity: 70.0 // Peak Sovereignty V18
      });
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 3 ? 25.0 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0508.0831";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy * coherence;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 100);
  }
}

function ta_std(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Sovereign Resonance [v26.0508.0831]");






















