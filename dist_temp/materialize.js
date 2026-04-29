"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./src/index");
var fs = __importStar(require("fs"));
// Mock Data Generator: Simulating Polarization & Pricing Power
function generateMockHistory() {
    var history = [];
    var basePrice = 130000;
    // 58 bars of noise
    for (var i = 0; i < 58; i++) {
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
var history = generateMockHistory();
var tokens = index_1.KronosTokenizer.tokenize(history);
var streamData = {
    version: "v26.0429.1530",
    source: "Kronos-Replication-Spirit",
    timestamp: new Date().toISOString(),
    marketRegime: index_1.KronosTokenizer.identifyRegime(history),
    tokens: tokens,
    rawTail: history.slice(-1)
};
fs.writeFileSync("stream.json", JSON.stringify(streamData, null, 2));
console.log("Materialized Polarization & Pricing Power tokens [v26.0429.1530]");
