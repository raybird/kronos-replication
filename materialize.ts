import { KronosTokenizer } from "./src/index";
import { Kline } from "./src/types";
import * as fs from "fs";

// Mock Data Generator: Simulating a Liquidity Void followed by an Absorption event
function generateMockHistory(): Kline[] {
  const history: Kline[] = [];
  const basePrice = 60000;
  
  // 48 bars of "normal" action
  for (let i = 0; i < 48; i++) {
    history.push({
      timestamp: Date.now() - (50 - i) * 60000,
      open: basePrice + Math.random() * 20,
      high: basePrice + 30,
      low: basePrice - 10,
      close: basePrice + Math.random() * 20,
      volume: 200 + Math.random() * 100
    });
  }

  // Bar 49: Liquidity Void (Large body, low volume)
  history.push({
    timestamp: Date.now() - 60000,
    open: basePrice,
    high: basePrice + 200,
    low: basePrice - 10,
    close: basePrice + 190,
    volume: 150 // Relatively low for such a move
  });

  // Bar 50: Institutional Absorption (High volume, narrow range)
  history.push({
    timestamp: Date.now(),
    open: basePrice + 190,
    high: basePrice + 210,
    low: basePrice + 100, // Long tail
    close: basePrice + 195,
    volume: 1200 // Spike in volume
  });

  return history;
}

const history = generateMockHistory();
const tokens = KronosTokenizer.tokenize(history);
const streamData = {
  version: "v26.0427.0430",
  source: "Kronos-Replication-Spirit",
  timestamp: new Date().toISOString(),
  marketRegime: KronosTokenizer.identifyRegime(history),
  tokens: tokens,
  rawTail: history.slice(-1)
};

fs.writeFileSync("stream.json", JSON.stringify(streamData, null, 2));
console.log("Materialized semantic tokens to stream.json [v26.0427.0430]");
