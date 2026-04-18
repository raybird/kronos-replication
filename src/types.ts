/**
 * Kronos Replication: Core Data Schemas
 * Version: v26.0418.0715
 */

export interface Kline {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export enum MarketRegime {
  BullishTrending = "BULL_TREND",
  BearishTrending = "BEAR_TREND",
  HighVolatilityRange = "HIGH_VOL_RANGE",
  LowVolatilityRange = "LOW_VOL_RANGE",
  Exhaustion = "EXHAUSTION"
}

export interface FinancialToken {
  type: string; // e.g., "ENGULFING_BULL", "HAMMER", "BREAKOUT"
  confidence: number;
  causalDensity: number;
}

export interface KronosForecast {
  targetAsset: string;
  horizon: number; // in bars
  expectedMove: number; // percentage
  volatilityEstimate: number;
  regime: MarketRegime;
}
