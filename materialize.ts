import { KronosTokenizer } from "./src/index";
import { Kline } from "./src/types";
import * as fs from "fs";

// Mock Data Generator: Simulating Intent Chaining (Sweep then Breakout)
function generateMockHistory(): Kline[] {
  const history: Kline[] = [];
  const basePrice = 130000;
  
  // 55 bars total before the sweep
  for (let i = 0; i < 55; i++) {
    history.push({
      timestamp: Date.now() - (60 - i) * 60000,
      open: basePrice + Math.random() * 50,
      high: basePrice + 100,
      low: basePrice - 100,
      close: basePrice + Math.random() * 50,
      volume: 400
    });
  }

  // Bar 56: Liquidity Sweep Bull (Low pierce, close back in range)
  history.push({
    timestamp: Date.now() - 4 * 60000,
    open: basePrice,
    high: basePrice + 50,
    low: basePrice - 200, // Sweep low
    close: basePrice + 10,
    volume: 800
  });

  // Bar 57-59: Consolidation
  for (let i = 57; i < 60; i++) {
    history.push({
      timestamp: Date.now() - (60 - i) * 60000,
      open: basePrice + 10,
      high: basePrice + 40,
      low: basePrice - 10,
      close: basePrice + 20,
      volume: 300
    });
  }

  // Bar 60: Chained Breakout (High body, high volume)
  history.push({
    timestamp: Date.now(),
    open: basePrice + 20,
    high: basePrice + 400, 
    low: basePrice + 10,
    close: basePrice + 380,
    volume: 2000 // Confirmation volume
  });

  return history;
}

const history = generateMockHistory();
const tokens = KronosTokenizer.tokenize(history);
const streamData = {
  version: "v26.0428.2030",
  source: "Kronos-Replication-Spirit",
  timestamp: new Date().toISOString(),
  marketRegime: KronosTokenizer.identifyRegime(history),
  tokens: tokens,
  rawTail: history.slice(-1)
};

fs.writeFileSync("stream.json", JSON.stringify(streamData, null, 2));
console.log(`Materialized Chained Intent tokens [v26.0428.2030]`);
