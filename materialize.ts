import { KronosTokenizer } from "./src/index";
import { Kline } from "./src/types";
import * as fs from "fs";

// Mock Data Generator: Simulating Squeeze then Ensemble Displacement
function generateMockHistory(): Kline[] {
  const history: Kline[] = [];
  const basePrice = 120000;
  
  // 55 bars of decreasing volatility (The Squeeze)
  for (let i = 0; i < 55; i++) {
    const range = 50 * (1 - i / 100); // Progressively tighter
    history.push({
      timestamp: Date.now() - (60 - i) * 60000,
      open: basePrice + Math.random() * range,
      high: basePrice + range + 10,
      low: basePrice - 10,
      close: basePrice + Math.random() * range,
      volume: 400 * (1 - i / 100) // Decreasing volume
    });
  }

  // Bars 56-59: Extreme Squeeze
  for (let i = 56; i < 60; i++) {
    history.push({
      timestamp: Date.now() - (60 - i) * 60000,
      open: basePrice,
      high: basePrice + 5,
      low: basePrice - 5,
      close: basePrice + 2,
      volume: 50 // High compression
    });
  }

  // Bar 60: Ensemble Displacement (Explosive move)
  history.push({
    timestamp: Date.now(),
    open: basePrice + 2,
    high: basePrice + 800, 
    low: basePrice - 10,
    close: basePrice + 780,
    volume: 3000 // Huge confirmation volume
  });

  return history;
}

const history = generateMockHistory();
const tokens = KronosTokenizer.tokenize(history);
const streamData = {
  version: "v26.0429.0430",
  source: "Kronos-Replication-Spirit",
  timestamp: new Date().toISOString(),
  marketRegime: KronosTokenizer.identifyRegime(history),
  cbs: (tokens as any).cbs,
  tokens: tokens,
  rawTail: history.slice(-1)
};

fs.writeFileSync("stream.json", JSON.stringify(streamData, null, 2));
console.log(`Materialized CPCV-Ready tokens with CBS: ${streamData.cbs} [v26.0429.0430]`);
