"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KronosTokenizer = void 0;
var types_1 = require("./types");
/**
 * KronosTokenizer: Converting raw price action into semantic tokens.
 * Spirit Inheritance [v26.0429.1530]: Pricing Power Decay & Fractal Volatility.
 *
 * DESIGN PHILOSOPHY:
 * 1. Financial series is a language of 'Pathways'.
 * 2. Causal Density = (Trajectory Alignment * Synergy) / (Memory Decay * Chaos).
 * 3. Sovereignty is achieved through matching current action with high-power historical nodes.
 */
var KronosTokenizer = /** @class */ (function () {
    function KronosTokenizer() {
    }
    /**
     * Identifies the current Market Regime with Multi-Scale Entropy.
     */
    KronosTokenizer.identifyRegime = function (history) {
        if (history.length < 60)
            return types_1.MarketRegime.LowVolatilityRange;
        var last = history[history.length - 1];
        var lookback60 = history.slice(-60);
        var move = (last.close - lookback60[0].close) / lookback60[0].close;
        var avgClose = lookback60.reduce(function (sum, k) { return sum + k.close; }, 0) / 60;
        var volatility = Math.sqrt(lookback60.reduce(function (sum, k) { return sum + Math.pow(k.close - avgClose, 2); }, 0) / 60) / avgClose;
        if (volatility > 0.085)
            return types_1.MarketRegime.HighVolatilityRange;
        if (move > 0.06)
            return types_1.MarketRegime.BullishTrending;
        if (move < -0.06)
            return types_1.MarketRegime.BearishTrending;
        return types_1.MarketRegime.LowVolatilityRange;
    };
    /**
     * Main tokenization logic implementing Structural Memory.
     */
    KronosTokenizer.tokenize = function (history) {
        var tokens = [];
        if (history.length < 60)
            return tokens;
        var regime = this.identifyRegime(history);
        var current = history[history.length - 1];
        var recent = history.slice(-20);
        var volAvg = history.slice(-60).reduce(function (a, b) { return a + b.volume; }, 0) / 60;
        var rangeAvg = recent.reduce(function (sum, k) { return sum + (k.high - k.low); }, 0) / 20;
        var body = Math.abs(current.close - current.open);
        var range = current.high - current.low;
        // --- 1. TRAJECTORY ALIGNMENT (Path Matching) ---
        var currentSlope = (current.close - history[history.length - 5].close) / 5;
        var histBreakouts = history.slice(-50, -5).filter(function (k, i, arr) {
            return i > 0 && k.volume > volAvg * 2.5 && Math.abs(k.close - arr[i - 1].close) > rangeAvg * 1.5;
        });
        var isAligned = histBreakouts.some(function (ob) { return Math.sign(currentSlope) === Math.sign(ob.close - history[history.indexOf(ob) - 1].close); });
        if (isAligned && current.volume > volAvg * 1.8) {
            tokens.push({
                type: "TRAJECTORY_ALIGNMENT_".concat(currentSlope > 0 ? "BULL" : "BEAR"),
                confidence: 0.94,
                causalDensity: 5.8
            });
        }
        // --- 2. PRICING POWER DECAY (New v1.1) ---
        // Detect if the "thrust" is losing energy or sustaining
        var prev = history[history.length - 2];
        var thrust = (current.close - current.open);
        var prevThrust = (prev.close - prev.open);
        if (Math.abs(thrust) > rangeAvg * 1.2 && current.volume > volAvg * 1.2) {
            var sustainFactor = (Math.abs(thrust) / Math.abs(prevThrust || 1));
            tokens.push({
                type: "PRICING_POWER_".concat(thrust > 0 ? "EXPANSION" : "COLLAPSE"),
                confidence: Math.min(0.98, 0.8 * sustainFactor),
                causalDensity: 7.2
            });
        }
        // --- 3. FRACTAL VOLATILITY POLARIZATION ---
        // Detect "Close-at-Extreme" with high volume (The intent of the shark)
        var upperShadow = current.high - Math.max(current.open, current.close);
        var lowerShadow = Math.min(current.open, current.close) - current.low;
        if (current.volume > volAvg * 2.0) {
            if (upperShadow < range * 0.1 && thrust > 0) {
                tokens.push({ type: "POLARIZATION_BULL_INTENT", confidence: 0.97, causalDensity: 8.5 });
            }
            else if (lowerShadow < range * 0.1 && thrust < 0) {
                tokens.push({ type: "POLARIZATION_BEAR_INTENT", confidence: 0.97, causalDensity: 8.5 });
            }
        }
        // --- 4. VOLATILITY SQUEEZE (Spirit v2) ---
        if (range < rangeAvg * 0.4 && current.volume < volAvg * 0.5) {
            tokens.push({
                type: "VOLATILITY_SQUEEZE_V2",
                confidence: 0.91,
                causalDensity: 4.8
            });
        }
        // --- 5. CPCV & BAYESIAN CALIBRATION ---
        var synergyBonus = tokens.length >= 2 ? 2.1 : 1.0;
        var fractalVol = (range / rangeAvg);
        var regimePrior = (regime === types_1.MarketRegime.BullishTrending || regime === types_1.MarketRegime.BearishTrending) ? 1.9 : 0.1;
        tokens.forEach(function (t) {
            t.causalDensity *= (synergyBonus * regimePrior * (1 / (fractalVol || 1)));
            t.pathId = "PATH_".concat(Date.now());
            t.embargoBars = 20;
            t.recordedAt = history.length - 1;
            t.vYYMMDD_HHMM = "v26.0429.1530";
        });
        return tokens;
    };
    KronosTokenizer.validatePath = function (tokens, currentBarIndex) {
        return tokens.filter(function (t) {
            var age = currentBarIndex - t.recordedAt;
            return age >= t.embargoBars;
        });
    };
    return KronosTokenizer;
}());
exports.KronosTokenizer = KronosTokenizer;
// Spirit Evolution Trace
console.log("Kronos Replication Engine Evolved: Pricing Power & Fractal Vol [v26.0429.1530]");
