import { KronosTokenizer } from "./src/index";
import { Kline } from "./src/types";
import * as fs from "fs";

// Mock Data Generator: Simulating a Structural Imbalance event (Aggressive Breakout)
function generateMockHistory(): Kline[] {
  const history: Kline[] = [];
  const basePrice = 70000;
  
  // 49 bars of "consolidation" action
  for (let i = 0; i < 49; i++) {
    history.push({
      timestamp: Date.now() - (50 - i) * 60000,
      open: basePrice + Math.random() * 20,
      high: basePrice + 50,
      low: basePrice - 50,
      close: basePrice + Math.random() * 20,
      volume: 300 + Math.random() * 100
    });
  }

  // Bar 50: Structural Imbalance (Bull Breakout with high volume/body)
  history.push({
    timestamp: Date.now(),
    open: basePrice + 20,
    high: basePrice + 300, 
    low: basePrice + 10,
    close: basePrice + 280,
    volume: 1500 // High volume relative to 300-400 avg
  });

  return history;
}

const history = generateMockHistory();
const tokens = KronosTokenizer.tokenize(history);
const streamData = {
  version: "v26.0427.0830",
  source: "Kronos-Replication-Spirit",
  timestamp: new Date().toISOString(),
  marketRegime: KronosTokenizer.identifyRegime(history),
  tokens: tokens,
  rawTail: history.slice(-1)
};

fs.writeFileSync("stream.json", JSON.stringify(streamData, null, 2));
console.log("Materialized semantic tokens to stream.json [v26.0427.0830]");
