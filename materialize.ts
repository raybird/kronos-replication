import { KronosTokenizer } from "./src/index";
import { Kline } from "./src/types";
import * as fs from "fs";

// Mock Data Generator: Simulating Trajectory Alignment & POC Retest
function generateMockHistory(): Kline[] {
  const history: Kline[] = [];
  const basePrice = 130000;
  
  // 59 bars total
  for (let i = 0; i < 59; i++) {
    if (i === 15) {
      // Historical High-Volume Breakout (Slope reference)
      history.push({
        timestamp: Date.now() - (60 - i) * 60000,
        open: basePrice,
        high: basePrice + 500,
        low: basePrice - 10,
        close: basePrice + 450,
        volume: 3000 // High volume node
      });
    } else {
      history.push({
        timestamp: Date.now() - (60 - i) * 60000,
        open: basePrice + 450 + Math.random() * 50,
        high: basePrice + 600,
        low: basePrice + 300,
        close: basePrice + 450 + Math.random() * 50,
        volume: 500
      });
    }
  }

  // Bar 60: Retesting the POC at 130450 and aligning with the breakout slope
  history.push({
    timestamp: Date.now(),
    open: basePrice + 450,
    high: basePrice + 550,
    low: basePrice + 440,
    close: basePrice + 540,
    volume: 1800 
  });

  return history;
}

const history = generateMockHistory();
const tokens = KronosTokenizer.tokenize(history);
const streamData = {
  version: "v26.0429.0830",
  source: "Kronos-Replication-Spirit",
  timestamp: new Date().toISOString(),
  marketRegime: KronosTokenizer.identifyRegime(history),
  tokens: tokens,
  rawTail: history.slice(-1)
};

fs.writeFileSync("stream.json", JSON.stringify(streamData, null, 2));
console.log(`Materialized Trajectory Alignment tokens [v26.0429.0830]`);
