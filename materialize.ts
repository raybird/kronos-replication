import { KronosTokenizer } from "./src/index";
import { Kline } from "./src/types";
import * as fs from "fs";

// Mock Data Generator: Simulating an Order Block Retest
function generateMockHistory(): Kline[] {
  const history: Kline[] = [];
  const basePrice = 120000;
  
  // 59 bars total
  for (let i = 0; i < 59; i++) {
    if (i === 20) {
      // Create an Order Block at bar 20
      history.push({
        timestamp: Date.now() - (60 - i) * 60000,
        open: basePrice,
        high: basePrice + 10,
        low: basePrice - 10,
        close: basePrice + 2,
        volume: 2000 // High volume tight range
      });
    } else {
      history.push({
        timestamp: Date.now() - (60 - i) * 60000,
        open: basePrice + Math.random() * 50,
        high: basePrice + 100,
        low: basePrice - 100,
        close: basePrice + Math.random() * 50,
        volume: 500
      });
    }
  }

  // Bar 60: Retesting the OB at basePrice
  history.push({
    timestamp: Date.now(),
    open: basePrice + 10,
    high: basePrice + 20,
    low: basePrice - 5, // Touches the OB
    close: basePrice + 15,
    volume: 1500 // High volume on retest
  });

  return history;
}

const history = generateMockHistory();
const tokens = KronosTokenizer.tokenize(history);
const streamData = {
  version: "v26.0428.0830",
  source: "Kronos-Replication-Spirit",
  timestamp: new Date().toISOString(),
  marketRegime: KronosTokenizer.identifyRegime(history),
  tokens: tokens,
  rawTail: history.slice(-1)
};

fs.writeFileSync("stream.json", JSON.stringify(streamData, null, 2));
console.log(`Materialized Structural Memory tokens [v26.0428.0830]`);
