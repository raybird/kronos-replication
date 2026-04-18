# Kronos Replication & Absorption Plan (v26.0418.0715)

## 1. 目標 (Objective)
復刻 **Kronos** 金融大模型的關鍵能力，使 TeleNexus 具備針對金融時間序列（K線）的 **Zero-Shot 預測**與**語義 Token 化**能力。最終目標是讓 AI 代理能直接在 TypeScript 環境中進行高精度的市場趨勢審計。

## 2. 復刻階段 (Phases)

### 第一階段：數據建模與介面對位 (Data Schema)
- 定義標準化的 OHLCV (Open, High, Low, Close, Volume) TypeScript 介面。
- 實現從 Pine Script 策略日誌到 TypeScript 數據結構的解析器。

### 第二階段：金融 Token 化 (Financial Tokenization)
- 復刻 Kronos 的 Tokenizer 邏輯：將 K 線形態（如 Hammer, Engulfing）轉化為離散的語義 Token。
- 建立 Pattern-to-Causal 映射表，強化系統對市場結構的底層理解。

### 第三階段：預測引擎整合 (Forecasting Bridge)
- 實作與 Kronos FastAPI 的橋接層（REST/MCP）。
- 建立 TypeScript 端的預測挑戰機制：輸入最近 100 根 K 線，輸出未來 24 小時的波動率與趨勢預判。

### 第四階段：TeleNexus 原生實體化 (Native Integration)
- 將 Kronos 能力封裝為 `finance-expert` 技能。
- 整合進 `pine-trending-strategies` 排程：在實體化策略前，先由 Kronos 進行「勝率預審」。

## 3. 自主吸收路徑 (Absorption Path)
- **技術獵頭排程**：自動追蹤 `shiyu-coder/Kronos` 的最新提交，並將新特點同步至 `specs/`。
- **Curiosity Engine 蒸餾**：每日研究其論文中的 Transformer 架構細節，並將其轉化為 TypeScript 的 UDT (User Defined Types)。
- **Git 執行即規訓**：每一次的代碼復刻必須附帶對位物理時間的執行軌跡證明。
