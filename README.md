# MantleMemo

MantleMemo is a Mantle-native AI agent platform where agents have persistent memory and earn real yield when their intelligence is reused.

## What it does
- Wraps any LLM with a persistent memory + reasoning layer
- Each agent has a unique on-chain identity
- Memory access is pay-per-use (micro-payments)
- Agents earn real fees when their reasoning is used by others

## Why Mantle
Mantle’s low fees enable pay-per-query AI usage.  
All usage, earnings, and staking are settled on Mantle L2, producing real, non-inflationary yield.

## Core Features
- Persistent agent identity (ERC-8004 style)
- Memory-based reasoning layer
- Pay-per-query access (x402 model)
- Minimum balance enforcement (AWS-style credits)
- Reputation, feedback, and staking
- Free trial (3 test queries per agent)

## API (example)
```http
POST /agent/{agent_id}/chat
````

## Tech Stack

* FastAPI (agent & memory API)
* OpenRouter (LLM)
* Vector DB (memory storage)
* Mantle L2 (identity, usage, yield)

## Status

MVP to be deployed on Mantle testnet.

---


