# Claude.md — Compass (Wealthsimple AI Builders Submission)

## Why this exists
This repo builds **Compass**, a **Pre-Execution Trade Consequence Interpreter**.
It sits between a retail investor’s **order draft** and **order execution** to translate the trade into **structural consequences** (not definitions), so the human understands what changes in their financial reality before submitting.

This is built for Wealthsimple’s **AI Builders** application: proof of building > résumé.

---

## Idea in one sentence
**A lightweight “interpretation layer” that intercepts a trade and turns raw parameters into consequence cards + a clarity checkpoint before execution.**

---

## Problem (real retail pain)
Retail investors can access options and fast trading flows, but they often cannot reason about:
- **Options:** leverage, break-even, expiry risk, and how a call differs from buying shares with the same money
- **Cost basis dilution:** why buying more at a higher price makes % return drop even if price didn’t change

This is a cognitive gap, not a feature gap.

---

## Human + AI boundary (explicit)
- **AI responsibility:** compute + explain trade consequences using provided inputs; surface structural differences; output deterministic JSON for UI
- **Human responsibility:** confirm understanding and submit (or cancel). AI never executes and never recommends.

The product enforces a **Clarity Checkpoint** (3 acknowledgments) before “Submit Order” becomes active.

---

## MVP scope (what is built)
### UI (Next.js)
- iPhone-first interstitial screen: **Compass: Trade Interpretation**
- Two demo modes:
  - **Options (Call)**
  - **Averaging Up**
- Consequence cards load sequentially (stagger fade) to feel guided, not like a dashboard dump
- “Demo Mode” label visible under the toggle for panel clarity
- “I Understand — Submit Order” button disabled until all 3 checkboxes checked

### Backend (thin API)
- Single POST endpoint: `/api/interpret`
- Accepts a trade payload (call_option or stock_buy)
- Produces structured JSON response that maps directly to UI cards
- Uses an LLM with a strict system prompt to prevent advice/prediction and to avoid hallucinated numbers

---

## Non-goals (intentionally not built)
- No brokerage integration / order execution
- No authentication
- No portfolio sync
- No real-time market data plumbing (optional delta is allowed; missing delta hides sensitivity)
- No database

This is an **AI-native workflow prototype**, not a full trading platform.

---

## Data contracts

### Input payloads
#### Call option
```json
{
  "type": "call_option",
  "ticker": "TSLA",
  "current_price": 250,
  "strike": 250,
  "expiry": "2027-03-21",
  "contracts": 1,
  "premium": 7.50,
  "premium_unit": "per_share",
  "delta": 0.55
}

##Stock buy (averaging up)
```json

    {
    "type": "stock_buy",
    "ticker": "TSLA",
    "current_price": 200,
    "current_shares": 100,
    "avg_cost": 150,
    "buy_shares": 50,
    "buy_price": 200
    }
```json

## Output payloads (UI renders directly)
call_option output keys

    - the_reality

    - break_even

    - max_loss

    - stock_comparison

    - sensitivity (omit if delta missing)

    - acknowledgments (exactly 3)

    - stock_buy output keys

    - new_reality

    - return_shift_explanation

    - structural_change

    - downside_scenario

    - acknowledgments (exactly 3)

## Error output (replaces normal response)
```json

{ "error": "Missing field: strike. Cannot compute break-even price or max loss." }




## System prompt (authoritative constraint)

This project relies on a strict system prompt to:

    - avoid advice (“should”, “recommend”, etc.)
    - avoid predictions
    - avoid generic disclaimers
    - compute derived values deterministically from provided inputs
    - degrade gracefully when data is missing

The system prompt is stored in:

docs/compassPrompt.ts and is passed verbatim to the model for /api/interpret.