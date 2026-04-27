import { KronosTokenizer } from "./src/index";
import { Kline } from "./src/types";
import * as fs from "fs";

// Mock Data Generator: Simulating a Momentum Velocity event (Aggressive Move)
function generateMockHistory(): Kline[] {
  const history: Kline[] = [];
  const basePrice = 80000;
  
  // 49 bars of "stagnant" action
  for (let i = 0; i < 49; i++) {
    history.push({
      timestamp: Date.now() - (50 - i) * 60000,
      open: basePrice + Math.random() * 10,
      high: basePrice + 15,
      low: basePrice - 15,
      close: basePrice + Math.random() * 10,
      volume: 200 + Math.random() * 50
    });
  }

  // Bar 50: Momentum Velocity (Sharp spike with volume)
  history.push({
    timestamp: Date.now(),
    open: basePrice,
    high: basePrice + 600, 
    low: basePrice - 10,
    close: basePrice + 550,
    volume: 1800 // Huge spike
  });

  return history;
}

const history = generateMockHistory();
const tokens = KronosTokenizer.tokenize(history);
const streamData = {
  version: "v26.0427.1530",
  source: "Kronos-Replication-Spirit",
  timestamp: new Date().toISOString(),
  marketRegime: KronosTokenizer.identifyRegime(history),
  tokens: tokens,
  rawTail: history.slice(-1)
};

fs.writeFileSync("stream.json", JSON.stringify(streamData, null, 2));
console.log("Materialized semantic tokens to stream.json [v26.0427.1530]");
