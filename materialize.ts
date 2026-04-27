import { KronosTokenizer } from "./src/index";
import { Kline } from "./src/types";
import * as fs from "fs";

// Mock Data Generator: Simulating Equilibrium Compression (Low entropy)
function generateMockHistory(): Kline[] {
  const history: Kline[] = [];
  const basePrice = 90000;
  
  // 45 bars of "normal" action
  for (let i = 0; i < 45; i++) {
    history.push({
      timestamp: Date.now() - (50 - i) * 60000,
      open: basePrice + Math.random() * 20,
      high: basePrice + 50,
      low: basePrice - 50,
      close: basePrice + Math.random() * 20,
      volume: 400 + Math.random() * 100
    });
  }

  // Last 5 bars: Declining volume + Tight range (Equilibrium Compression)
  for (let i = 0; i < 5; i++) {
    history.push({
      timestamp: Date.now() - (5 - i) * 60000,
      open: basePrice,
      high: basePrice + 10,
      low: basePrice - 10,
      close: basePrice + 2,
      volume: 300 - i * 50 // Declining volume
    });
  }

  return history;
}

const history = generateMockHistory();
const tokens = KronosTokenizer.tokenize(history);
const streamData = {
  version: "v26.0427.2030",
  source: "Kronos-Replication-Spirit",
  timestamp: new Date().toISOString(),
  marketRegime: KronosTokenizer.identifyRegime(history),
  cbs: (tokens as any).cbs,
  tokens: tokens,
  rawTail: history.slice(-1)
};

fs.writeFileSync("stream.json", JSON.stringify(streamData, null, 2));
console.log(`Materialized semantic tokens with CBS: ${streamData.cbs} [v26.0427.2030]`);
