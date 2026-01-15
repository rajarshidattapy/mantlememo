# MantleMemo: Built for Mantle Global Hackathon 2025

MantleMemo turns AI conversations into reusable intelligence coordinated on Mantle.  
Instead of fine-tuning models or rebuilding prompts, MantleMemo captures long-term agent memory and exposes it as permissioned, composable intelligence.

## What it does
- Wraps any stateless LLM with persistent memory
- Each LLM can have multiple isolated chats (memory capsules)
- Memory is reused across apps via API or SDK
- Intelligence stays off-chain; trust, access, and payments live on Mantle.

## Why Mantle
Mantle provides low-cost, high-frequency coordination for agent identity, access control, staking, and usage tracking.  
This makes intelligence portable, trustless, and composable across applications.

## Core Concepts
- **Agent**: Persistent identity that owns intelligence
- **Chat (Capsule)**: Isolated memory scope within an agent
- **Memory**: Semantic knowledge extracted from conversations
- **Runtime**: Injects memory into LLM calls without modifying the model

## SDK Usage (Read-Only)
```python
from mantlememo import Agent

agent = Agent(
    agent_id="agent_123",
    chat_id="governance_chat",
)

response = agent.chat("Analyze proposal X")
````

## Architecture

* **Frontend**: React with MetaMask integration
* **Runtime**: FastAPI
* **Chats & Messages**: Redis
* **Agents & Capsules**: PostgreSQL
* **Semantic Memory**: mem0 (off-chain)
* **Coordination Layer**: Mantle (EVM)

## Wallet & Payments

* **Wallet**: MetaMask (EVM-compatible)
* **Network**: Mantle Sepolia Testnet (Chain ID: 5003)
* **Token**: MNT (native gas token)
* **RPC**: https://rpc.sepolia.mantle.xyz
* **Explorer**: https://explorer.sepolia.mantle.xyz

## What MantleMemo is NOT

* ❌ No model fine-tuning
* ❌ No raw data on-chain
* ❌ No prompt marketplace
* ❌ No AI inference on-chain

## Status

MVP live with SDK-based access to persistent agent intelligence on Mantle Sepolia Testnet.

