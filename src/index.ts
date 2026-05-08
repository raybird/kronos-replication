import { Kline, FinancialToken, MarketRegime } from "./types";

/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0508.2041]: Geometric Thermodynamic Equilibrium.
 * 
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a Thermodynamic system in curved phase space.
 * 2. Equilibrium = Minimization of Free Energy (Price - Target) relative to Entropy.
 * 3. Sovereignty is achieved through identifying 'Adiabatic' expansions (ordered growth).
 */
export class KronosTokenizer {
  private static tokenCache: FinancialToken[] = [];
  private static recursiveBias: number = 0;
  private static sPos: number = 0; 
  private static sNeg: number = 0; 
  private static reputationMatrix: Map<string, number> = new Map();
  private static freeEnergyHistory: number[] = [];

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
    if (Math.abs(macroMove) > atr * 9.0) return macroMove > 0 ? MarketRegime.BullishTrending : MarketRegime.BearishTrending;
    return MarketRegime.LowVolatilityRange;
  }

  /**
   * Main tokenization logic implementing Geometric Thermodynamic Audit.
   */
  public static tokenize(history: Kline[]): FinancialToken[] {
    let tokens: FinancialToken[] = [];
    if (history.length < 100) return tokens;

    const current = history[history.length - 1];
    const rangeAvg = history.slice(-20).reduce((sum, k) => sum + (k.high - k.low), 0) / 20;

    // --- 1. THERMODYNAMIC FREE ENERGY AUDIT (New v2041) ---
    const getFractalD = (len: number) => {
        const win = history.slice(-len);
        const displacement = Math.abs(win[win.length-1].close - win[0].close);
        const pathLength = win.reduce((s, k, i, arr) => i === 0 ? 0 : s + Math.abs(k.close - arr[i-1].close), 0);
        return pathLength / (displacement || 1);
    };
    const fd20 = getFractalD(20);
    const volZ = (current.volume - history.slice(-20).reduce((s, k) => s + k.volume, 0) / 20) / (ta_std(history.slice(-20).map(k => k.volume)) || 1);
    
    // Free Energy proxy: Price work vs Entropy (Fractal D)
    const priceWork = Math.abs(current.close - current.open) / (rangeAvg || 1);
    const freeEnergy = priceWork / (fd20 + 0.1);
    this.freeEnergyHistory.push(freeEnergy);
    if (this.freeEnergyHistory.length > 60) this.freeEnergyHistory.shift();

    // --- 2. ADIABATIC EXPANSION SENSING ---
    // Expansion without entropy increase = Highly Sovereign
    const isAdiabatic = freeEnergy > 1.5 && fd20 < 1.4 && Math.abs(volZ) > 2.0;

    // --- 3. RECURSIVE DECAY & EQUILIBRIUM ---
    this.tokenCache = this.tokenCache.filter(t => {
      const age = history.length - 1 - (t as any).recordedAt;
      const persistence = Math.exp(-age / (160 * (freeEnergy + 0.4))); 
      t.causalDensity *= persistence;
      return t.causalDensity > 22.0; // V20 Threshold
    });
    tokens = [...this.tokenCache];

    // --- 4. THERMODYNAMIC EQUILIBRIUM MASTER ---
    if (isAdiabatic && freeEnergy > (ta_std(this.freeEnergyHistory) * 2)) {
      tokens.push({
        type: "THERMODYNAMIC_EQUILIBRIUM_MASTER",
        confidence: 0.99998,
        causalDensity: 90.0 // Peak Sovereignty V20
      });
    }

    // --- FINAL POST-PROCESSING ---
    const synergy = tokens.length >= 3 ? 35.0 : 1.0;
    tokens.forEach(t => {
      if (!(t as any).recordedAt) {
        (t as any).recordedAt = history.length - 1;
        (t as any).vYYMMDD_HHMM = "v26.0508.2041";
        this.tokenCache.push(t);
      }
      t.causalDensity *= synergy * freeEnergy;
    });

    return tokens;
  }

  public static validatePath(tokens: FinancialToken[], currentBarIndex: number): FinancialToken[] {
    return tokens.filter(t => (currentBarIndex - (t as any).recordedAt) >= 120);
  }
}

function ta_std(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
}

// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Geometric Thermodynamic Equilibrium [v26.0508.2041]");
























