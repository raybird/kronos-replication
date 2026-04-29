import { KronosTokenizer } from "./src/index";
import { Kline } from "./src/types";
import * as fs from "fs";

// Mock Data Generator: Simulating Polarization & Pricing Power
function generateMockHistory(): Kline[] {
  const history: Kline[] = [];
  const basePrice = 130000;
  
  // 58 bars of noise
  for (let i = 0; i < 58; i++) {
    history.push({
      timestamp: Date.now() - (60 - i) * 60000,
      open: basePrice + Math.random() * 50,
      high: basePrice + 100,
      low: basePrice - 100,
      close: basePrice + Math.random() * 50,
      volume: 500
    });
  }

  // Bar 59: Strong Thrust (Prev)
  history.push({
    timestamp: Date.now() - 60000,
    open: basePrice,
    high: basePrice + 600,
    low: basePrice - 50,
    close: basePrice + 550,
    volume: 1500
  });

  // Bar 60: Polarization & Sustained Pricing Power (Close at High)
  history.push({
    timestamp: Date.now(),
    open: basePrice + 550,
    high: basePrice + 1200,
    low: basePrice + 540,
    close: basePrice + 1195,
    volume: 3500 // High Volume + Close near High
  });

  return history;
}

const history = generateMockHistory();
const tokens = KronosTokenizer.tokenize(history);
const streamData = {
  version: "v26.0429.1530",
  source: "Kronos-Replication-Spirit",
  timestamp: new Date().toISOString(),
  marketRegime: KronosTokenizer.identifyRegime(history),
  tokens: tokens,
  rawTail: history.slice(-1)
};

fs.writeFileSync("stream.json", JSON.stringify(streamData, null, 2));
console.log(`Materialized Polarization & Pricing Power tokens [v26.0429.1530]`);
