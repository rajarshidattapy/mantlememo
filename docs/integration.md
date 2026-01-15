# Mantlememo Web3 Integration Documentation

## Overview

This document outlines how the Mantlememo UI has been integrated with the smart contract deployed at `0x4287F8a28AC24FF1b0723D26747CBE7F39C9C167` on Mantle Sepolia Testnet. The integration maintains the existing UI flow while adding blockchain functionality for true decentralization.

## Architecture

### Smart Contract Integration Layer

#### 1. Contract Interface (`src/contracts/MantlememoContract.ts`)
- **Purpose**: TypeScript interface for the Mantlememo smart contract
- **Features**:
  - Complete ABI definition with all contract functions
  - Type-safe interfaces matching Solidity structs
  - Utility functions for data formatting
  - Event listeners for real-time updates

#### 2. Contract Hook (`src/hooks/useContract.ts`)
- **Purpose**: React hook for contract interaction management
- **Features**:
  - Automatic contract initialization with wallet connection
  - Transaction execution wrapper with error handling
  - Loading states and error management
  - Custom error message parsing for user-friendly feedback

#### 3. On-Chain Data Hook (`src/hooks/useOnChainData.ts`)
- **Purpose**: Centralized hook for fetching and managing blockchain data
- **Features**:
  - User's capsules and agents from blockchain
  - Marketplace data from all contract events
  - Real-time data synchronization
  - Caching and performance optimization

### Payment System Integration

#### 1. Enhanced Payment Utils (`src/utils/mantlePayment.ts`)
- **Legacy Support**: Maintains existing `sendPayment()` for backward compatibility
- **New Functions**:
  - `queryCapsuleWithContract()`: Smart contract-based capsule queries
  - `stakeOnCapsule()`: Blockchain staking functionality
- **Error Handling**: Contract-specific error messages and user guidance

#### 2. Updated Query Hook (`src/hooks/useCapsuleQuery.ts`)
- **Integration**: Uses smart contract for payment instead of direct transfers
- **Flow**: Query → Contract Payment → Backend Verification → Response
- **Benefits**: Transparent, verifiable payments with automatic earnings distribution

## UI Component Updates

### 1. Marketplace (`src/pages/Marketplace.tsx`)

**Before Integration:**
- Fetched capsule data from backend API only
- Used direct MNT transfers for purchases
- Limited to backend-stored capsule information

**After Integration:**
- **Data Source**: Loads capsules from blockchain via `getAllCapsuleLogs()`
- **Payment Method**: Uses `queryCapsuleWithContract()` for purchases
- **Real-time Updates**: Automatically refreshes when new capsules are staked
- **Enhanced Sorting**: Added "Highest Staked" option
- **Transparency**: Shows actual on-chain stake amounts and earnings

**Key Changes:**
```typescript
// Before: Direct API call
const data = await apiClient.browseMarketplace(filters);

// After: Blockchain + API hybrid
const { allCapsules } = useOnChainData();
// Supplemented with API data for query counts/ratings
```

### 2. Staking Dashboard (`src/pages/Staking.tsx`)

**Before Integration:**
- Placeholder staking to demo addresses
- No actual blockchain interaction
- Manual capsule creation via API

**After Integration:**
- **Smart Contract Staking**: Real MNT locking with 7-day periods
- **Capsule Creation**: On-chain capsule registration
- **Stake Management**: Add stake, unstake with lock period validation
- **Real-time Status**: Shows lock periods and staking status

**Key Flow:**
1. User selects agent to stake
2. `contract.createCapsule()` - Creates capsule on blockchain
3. `contract.stake()` - Stakes MNT with lock period
4. Backend sync for additional metadata
5. Capsule appears in marketplace automatically

### 3. Earnings Dashboard (`src/pages/EarningsDashboard.tsx`)

**Before Integration:**
- Mock earnings data
- No withdrawal functionality
- Static charts and statistics

**After Integration:**
- **Real Earnings**: Shows actual MNT earned from queries
- **Withdrawal Function**: `contract.withdrawEarnings()` for each capsule
- **Live Data**: Real-time earnings tracking from blockchain
- **Performance Metrics**: Actual query counts and revenue per capsule

**Key Features:**
```typescript
// Withdraw earnings directly from smart contract
const handleWithdrawEarnings = async (capsuleId: string) => {
  const result = await contract.withdrawEarnings(capsuleId);
  await result.wait(); // Wait for confirmation
};
```

### 4. Capsule Query (`src/hooks/useCapsuleQuery.ts`)

**Before Integration:**
- Direct payment to creator wallet
- Manual payment verification
- No automatic earnings distribution

**After Integration:**
- **Smart Contract Payment**: Uses `contract.queryCapsule()`
- **Automatic Distribution**: Contract handles payment to creator
- **Transparent Pricing**: Enforced by contract price limits
- **Event Emission**: `CapsuleQueried` event for backend verification

## Data Flow Integration

### 1. Agent Registration Flow
```
UI: Create Agent → API: Store Agent Config → [Manual Staking Process]
```

### 2. Capsule Creation & Staking Flow
```
UI: Select Agent → Contract: createCapsule() → Contract: stake() → 
API: Sync Metadata → Marketplace: Auto-refresh
```

### 3. Marketplace Query Flow
```
UI: Select Capsule → Contract: queryCapsule() → Event: CapsuleQueried → 
API: Verify Payment → AI: Generate Response → UI: Display Result
```

### 4. Earnings & Withdrawal Flow
```
Contract: Track Earnings → UI: Display Balance → User: Withdraw → 
Contract: withdrawEarnings() → Wallet: Receive MNT
```

## Smart Contract Integration Points

### 1. Contract Constants Integration
- **Price Limits**: UI enforces `MIN_PRICE_PER_QUERY` (0.0001 MNT) to `MAX_PRICE_PER_QUERY` (1 MNT)
- **Stake Limits**: UI validates `MIN_STAKE_AMOUNT` (0.0001 MNT) to `MAX_STAKE_AMOUNT` (100 MNT)
- **Lock Period**: UI shows 7-day lock period for unstaking

### 2. Event Listeners
- **CapsuleCreated**: Refreshes marketplace when new capsules are added
- **CapsuleQueried**: Updates query counts and earnings
- **StakedOnCapsule**: Updates stake amounts in real-time
- **EarningsWithdrawn**: Refreshes earnings dashboard

### 3. Error Handling
Smart contract errors are mapped to user-friendly messages:
- `EmptyString` → "Input cannot be empty"
- `InvalidPrice` → "Price is outside allowed range"
- `CapsuleNotFound` → "Capsule not found on blockchain"
- `StakeLocked` → "Stake is still locked (7 day period)"
- `Unauthorized` → "You are not authorized to perform this action"

## Backward Compatibility

### 1. API Integration
- **Hybrid Approach**: Blockchain for core data, API for supplemental info
- **Graceful Degradation**: Falls back to API-only if blockchain unavailable
- **Data Enrichment**: API provides query counts, ratings, and chat history

### 2. Existing Features
- **Chat System**: Unchanged, still uses API for message storage
- **Agent Management**: Unchanged, still uses API for configuration
- **User Preferences**: Unchanged, still uses Redis/Vercel KV

## Security Considerations

### 1. Transaction Safety
- **User Confirmation**: All transactions require MetaMask approval
- **Amount Validation**: UI validates amounts before contract calls
- **Error Recovery**: Graceful handling of failed transactions

### 2. Data Integrity
- **Source of Truth**: Blockchain data takes precedence over API
- **Verification**: Payment signatures verified against contract events
- **Access Control**: Only capsule owners can stake/unstake/withdraw

## Performance Optimizations

### 1. Data Loading
- **Batch Calls**: Multiple contract calls batched where possible
- **Caching**: On-chain data cached in React state
- **Lazy Loading**: Marketplace data loaded on-demand

### 2. User Experience
- **Loading States**: Clear indicators during blockchain operations
- **Error Messages**: Specific, actionable error messages
- **Real-time Updates**: Event listeners for immediate UI updates

## Testing & Validation

### 1. Contract Interaction Testing
- **Network**: Mantle Sepolia Testnet
- **Contract**: `0x4287F8a28AC24FF1b0723D26747CBE7F39C9C167`
- **Test Scenarios**: Create capsule, stake, query, withdraw earnings

### 2. UI Flow Testing
- **Wallet Connection**: MetaMask integration
- **Transaction Flows**: End-to-end staking and querying
- **Error Handling**: Network failures, insufficient funds, user rejection

## Future Enhancements

### 1. Advanced Features
- **Reputation System**: On-chain reputation based on query success
- **Governance**: DAO voting for platform parameters
- **NFT Integration**: Capsules as tradeable NFTs

### 2. Performance Improvements
- **Indexing**: The Graph protocol for faster queries
- **Layer 2**: Additional scaling solutions
- **Caching**: Redis caching for frequently accessed data

## Deployment Notes

### 1. Environment Variables
```env
VITE_CONTRACT_ADDRESS=0x4287F8a28AC24FF1b0723D26747CBE7F39C9C167
VITE_MANTLE_RPC_URL=https://rpc.sepolia.mantle.xyz
VITE_MANTLE_CHAIN_ID=5003
```

### 2. Dependencies
- **ethers.js**: v6.x for Web3 interactions
- **React**: v18.x for UI framework
- **TypeScript**: v5.x for type safety

### 3. Browser Requirements
- **MetaMask**: Required for wallet connection
- **Modern Browser**: ES2020+ support required
- **Network**: Mantle Sepolia Testnet configured

## Conclusion

The integration successfully bridges the existing Mantlememo UI with the smart contract, providing:

1. **True Decentralization**: Core marketplace functions on blockchain
2. **Transparent Economics**: Verifiable staking and earnings
3. **User Control**: Direct ownership of capsules and earnings
4. **Seamless Experience**: Maintains familiar UI while adding Web3 benefits

The hybrid approach ensures reliability while maximizing decentralization, creating a robust foundation for the Mantlememo marketplace ecosystem.