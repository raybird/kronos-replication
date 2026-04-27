import { KronosTokenizer } from "./src/index";
import { Kline } from "./src/types";
import * as fs from "fs";

// Mock Data Generator: Simulating an Ensemble-Ready Trajectory event
function generateMockHistory(): Kline[] {
  const history: Kline[] = [];
  const basePrice = 110000;
  
  // 59 bars of normal action
  for (let i = 0; i < 59; i++) {
    history.push({
      timestamp: Date.now() - (60 - i) * 60000,
      open: basePrice + Math.random() * 50,
      high: basePrice + 100,
      low: basePrice - 100,
      close: basePrice + Math.random() * 50,
      volume: 500 + Math.random() * 200
    });
  }

  // Bar 60: Trajectory Path Velocity (Extreme displacement)
  history.push({
    timestamp: Date.now(),
    open: basePrice,
    high: basePrice + 800, 
    low: basePrice - 20,
    close: basePrice + 750,
    volume: 2500 // Ensemble-level volume
  });

  return history;
}

const history = generateMockHistory();
const tokens = KronosTokenizer.tokenize(history);
const streamData = {
  version: "v26.0428.0430",
  source: "Kronos-Replication-Spirit",
  timestamp: new Date().toISOString(),
  marketRegime: KronosTokenizer.identifyRegime(history),
  cbs: (tokens as any).cbs,
  ensembleStatus: (tokens as any).ensembleStatus,
  tokens: tokens,
  rawTail: history.slice(-1)
};

fs.writeFileSync("stream.json", JSON.stringify(streamData, null, 2));
console.log(`Materialized Ensemble-Ready tokens with CBS: ${streamData.cbs} [v26.0428.0430]`);
