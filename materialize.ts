import { KronosTokenizer } from "./src/index";
import { Kline } from "./src/types";
import * as fs from "fs";

// Mock Data Generator: Simulating Recursive Void Fill
function generateMockHistory(): Kline[] {
  const history: Kline[] = [];
  const basePrice = 100000;
  
  // 20 bars of stability
  for (let i = 0; i < 20; i++) {
    history.push({
      timestamp: Date.now() - (50 - i) * 60000,
      open: basePrice + Math.random() * 20,
      high: basePrice + 30,
      low: basePrice - 10,
      close: basePrice + Math.random() * 20,
      volume: 400
    });
  }

  // Bar 21: Liquidity Void Up (Large move, low volume)
  history.push({
    timestamp: Date.now() - 29 * 60000,
    open: basePrice,
    high: basePrice + 500,
    low: basePrice - 10,
    close: basePrice + 480,
    volume: 100
  });

  // Bars 22-49: Drifting down
  for (let i = 22; i < 49; i++) {
    history.push({
      timestamp: Date.now() - (50 - i) * 60000,
      open: basePrice + 480 - (i - 21) * 15,
      high: basePrice + 500 - (i - 21) * 15,
      low: basePrice + 450 - (i - 21) * 15,
      close: basePrice + 460 - (i - 21) * 15,
      volume: 300
    });
  }

  // Bar 50: Recursive Void Fill (Revisiting Bar 21 low)
  history.push({
    timestamp: Date.now(),
    open: basePrice + 50,
    high: basePrice + 60,
    low: basePrice - 20, // Pierces Bar 21 low
    close: basePrice + 10,
    volume: 1200 // High volume at fill
  });

  return history;
}

const history = generateMockHistory();
const tokens = KronosTokenizer.tokenize(history);
const streamData = {
  version: "v26.0427.2040",
  source: "Kronos-Replication-Spirit",
  timestamp: new Date().toISOString(),
  marketRegime: KronosTokenizer.identifyRegime(history),
  cbs: (tokens as any).cbs,
  tokens: tokens,
  rawTail: history.slice(-1)
};

fs.writeFileSync("stream.json", JSON.stringify(streamData, null, 2));
console.log(`Final Materialization for today complete. CBS: ${streamData.cbs} [v26.0427.2040]`);
