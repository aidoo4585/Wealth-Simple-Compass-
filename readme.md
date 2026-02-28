# Compass — Trade Interpretation Layer

Compass sits between intent and execution. Before a retail investor 
submits an order, it surfaces the structural consequences of that 
trade in plain language — not definitions, not advice, not predictions.

Built as a submission for the Wealthsimple AI Builders Program.

## The Problem
Retail investors are given access to complex instruments — options, 
margin, averaging strategies — without the cognitive infrastructure 
to reason about them. The UI enables the trade. It doesn't explain 
what changes if you make it.

## What Compass Does
- Interprets a call option order: break-even, max loss, delta 
  exposure, comparison to buying shares outright
- Interprets an averaging up order: new cost basis, why % return 
  shifts, total exposure change
- Forces a Clarity Checkpoint before execution — three consequence 
  acknowledgments the investor must confirm
- AI owns the interpretation. Human owns the decision.

## Tech
Next.js · Tailwind · Google Gemini API

## What breaks at scale
Oversimplification of genuinely complex instruments, model 
hallucination on numeric edge cases, and users mistaking 
interpretation for advice.
