import { KronosTokenizer } from "./src/index";
import { Kline } from "./src/types";
import * as fs from "fs";

// Mock Data Generator: Simulating an Institutional Absorption event followed by a breakout
function generateMockHistory(): Kline[] {
  const history: Kline[] = [];
  const basePrice = 50000;
  
  // 29 bars of "normal" action
  for (let i = 0; i < 29; i++) {
    history.push({
      timestamp: Date.now() - (30 - i) * 60000,
      open: basePrice + Math.random() * 10,
      high: basePrice + 15,
      low: basePrice - 5,
      close: basePrice + Math.random() * 10,
      volume: 100 + Math.random() * 50
    });
  }

  // Bar 30: The "Absorption Demand" event
  history.push({
    timestamp: Date.now(),
    open: basePrice,
    high: basePrice + 5,
    low: basePrice - 100, // Deep wick
    close: basePrice + 2, // Tiny body
    volume: 800 // High volume relative to 100-150 avg
  });

  return history;
}

const history = generateMockHistory();
const tokens = KronosTokenizer.tokenize(history);
const streamData = {
  version: "v26.0426.2035",
  source: "Kronos-Replication-Spirit",
  timestamp: new Date().toISOString(),
  marketRegime: KronosTokenizer.identifyRegime(history),
  tokens: tokens,
  rawTail: history.slice(-1)
};

fs.writeFileSync("stream.json", JSON.stringify(streamData, null, 2));
console.log("Materialized semantic tokens to stream.json");
