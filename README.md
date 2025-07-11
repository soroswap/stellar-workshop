# Workshop Rio - Stellar & Soroswap Integration

A comprehensive educational workshop demonstrating Stellar blockchain development and Soroswap integration for Rio University students.

## Overview

This repository contains two complete workshops that demonstrate the full lifecycle of creating and trading custom assets on the Stellar blockchain:

1. **Stellar Workshop** (`workshop-rio.ts`) - Basic Stellar asset creation and trading
2. **Soroswap Workshop** (`soroswap.ts`) - Advanced DeFi integration using Soroswap SDK

Both workshops create a custom "RIO" token and demonstrate different approaches to asset management and trading on the Stellar ecosystem.

## What You'll Learn

### Stellar Workshop
- Creating and funding wallets on Stellar testnet
- Issuing custom assets (RIO token)
- Creating trustlines between accounts
- Locking asset supply to prevent further minting
- Creating and managing liquidity pools
- Performing asset swaps through path payments

### Soroswap Workshop
- Deploying Stellar assets to Soroban smart contracts
- Using the Soroswap SDK for DeFi operations
- Adding liquidity to decentralized exchanges
- Quote → Build → Sign → Submit workflow for trading
- Integration with Soroban's smart contract platform

## Prerequisites

- Node.js 18+ installed
- TypeScript knowledge
- Basic understanding of blockchain concepts
- Stellar testnet account (automatically created in workshops)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd workshop-rio
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, for API keys):
```bash
# Optional: Add your Soroswap API key
SOROSWAP_API_KEY=your_api_key_here
```

## Usage

### Run the Stellar Workshop
```bash
npm run workshop
```

This will execute the basic Stellar workshop demonstrating:
- Wallet creation and funding
- RIO token issuance
- Liquidity pool creation
- Asset swapping

### Run the Soroswap Workshop
```bash
npm run soroswap
```

This will execute the advanced Soroswap workshop demonstrating:
- Soroban smart contract deployment
- Soroswap SDK integration
- Decentralized exchange operations
- Advanced trading workflows

## Workshop Flow

Both workshops follow a similar pattern:

1. **Setup Phase**: Create wallets and fund them with testnet XLM
2. **Asset Creation**: Issue custom RIO tokens
3. **Liquidity Provision**: Add liquidity to enable trading
4. **Trading**: Perform asset swaps
5. **Results**: Display final balances and transaction details

### Key Features

- **Educational Focus**: Comprehensive logging and explanations
- **Production-Ready**: Uses official Stellar and Soroswap SDKs
- **Testnet Safe**: All operations run on Stellar testnet
- **Interactive**: Real-time feedback and countdown timers
- **Comprehensive**: Covers both basic and advanced concepts

## Technical Architecture

### Dependencies
- `@stellar/stellar-sdk`: Official Stellar SDK for blockchain operations
- `@soroswap/sdk`: Soroswap SDK for DeFi operations
- `dotenv`: Environment variable management
- `typescript`: Type-safe development

### Network Configuration
- **Horizon Server**: `https://horizon-testnet.stellar.org`
- **Soroban RPC**: `https://soroban-testnet.stellar.org`
- **Network**: Stellar Testnet

## Educational Outcomes

By completing these workshops, students will understand:

1. **Blockchain Fundamentals**: How assets are created and managed on Stellar
2. **DeFi Concepts**: Liquidity provision, automated market makers, and trading
3. **Smart Contracts**: Deploying and interacting with Soroban contracts
4. **SDK Integration**: Using professional-grade SDKs for blockchain development
5. **Best Practices**: Proper error handling, transaction signing, and account management

## Wallet Management

The workshops create three types of wallets:

- **Asset Creator**: Issues the RIO token and manages supply
- **Token Holder**: Provides liquidity to enable trading
- **Trader**: Performs swaps and trades assets

All wallets are automatically funded using Stellar's Friendbot service.

## Security Notes

- All operations use testnet XLM (no real value)
- Private keys are generated randomly for each workshop run
- Asset supply is locked after issuance to prevent inflation
- Transactions include proper timeout and fee settings

## Troubleshooting

If you encounter issues:

1. **Network Issues**: Ensure stable internet connection
2. **Rate Limiting**: Wait between workshop runs if hitting API limits
3. **Transaction Failures**: Check Stellar Expert for transaction details
4. **SDK Errors**: Verify API keys and network configuration

## Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroswap Documentation](https://docs.soroswap.finance/)
- [Stellar Expert](https://stellar.expert/explorer/testnet) - Testnet explorer
- [Soroswap Interface](https://soroswap.finance/) - Trading interface

## License

MIT License - See LICENSE file for details

## Contributing

This is an educational workshop. For improvements or bug fixes, please create an issue or pull request.

---

*Built for Rio University students to learn blockchain development on Stellar* 🌟