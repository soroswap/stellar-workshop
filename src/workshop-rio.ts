import {
  Asset,
  Keypair,
  TransactionBuilder,
  Operation,
  LiquidityPoolAsset,
  getLiquidityPoolId,
  BASE_FEE,
  Networks,
  Horizon,
} from "@stellar/stellar-sdk";
import { HorizonApi } from "@stellar/stellar-sdk/lib/horizon";
import { config } from "dotenv";
config();

// Initialize Horizon server for Stellar testnet
const horizonServer = new Horizon.Server("https://horizon-testnet.stellar.org");

/**
 * 🌟 STELLAR WORKSHOP 🌟
 * 
 * This script demonstrates the complete lifecycle of creating a custom asset on Stellar:
 * 1. Create wallets (Asset Creator, Token Holder, Trader)
 * 2. Create a custom asset (RIO token)
 * 3. Issue tokens and remove minting ability
 * 4. Create a liquidity pool (RIO/XLM)
 * 5. Perform asset swaps via path payments
 */

async function stellarWorkshop() {
  console.log("🚀 Starting Stellar Workshop!");
  console.log("=" .repeat(60));

  try {
    // ========================================
    // STEP 1: CREATE WALLETS
    // ========================================
    console.log("\n📝 STEP 1: Creating Wallets");
    console.log("-".repeat(30));

    // Create the asset creator wallet (will issue the RIO token)
    const assetCreatorWallet = Keypair.random();
    console.log("🏛️  Asset Creator Wallet created:");
    console.log(`   Public Key: ${assetCreatorWallet.publicKey()}`);
    console.log(`   Secret Key: ${assetCreatorWallet.secret()}`);

    // Create the token holder wallet (will receive and hold tokens)
    const tokenHolderWallet = Keypair.random();
    console.log("\n💰 Token Holder Wallet created:");
    console.log(`   Public Key: ${tokenHolderWallet.publicKey()}`);
    console.log(`   Secret Key: ${tokenHolderWallet.secret()}`);

    // Create the trader wallet (will swap XLM for RIO tokens)
    const traderWallet = Keypair.random();
    console.log("\n🏪 Trader Wallet created:");
    console.log(`   Public Key: ${traderWallet.publicKey()}`);
    console.log(`   Secret Key: ${traderWallet.secret()}`);

    // ========================================
    // STEP 2: FUND WALLETS WITH TESTNET XLM
    // ========================================
    console.log("\n💳 STEP 2: Funding Wallets with Testnet XLM");
    console.log("-".repeat(30));

    console.log("🤖 Funding Asset Creator wallet with Friendbot...");
    await horizonServer.friendbot(assetCreatorWallet.publicKey()).call();
    console.log("✅ Asset Creator wallet funded successfully");

    console.log("🤖 Funding Token Holder wallet with Friendbot...");
    await horizonServer.friendbot(tokenHolderWallet.publicKey()).call();
    console.log("✅ Token Holder wallet funded successfully");

    console.log("🤖 Funding Trader wallet with Friendbot...");
    await horizonServer.friendbot(traderWallet.publicKey()).call();
    console.log("✅ Trader wallet funded successfully");

    // Check initial balances
    const assetCreatorAccount = await horizonServer.loadAccount(assetCreatorWallet.publicKey());
    const tokenHolderAccount = await horizonServer.loadAccount(tokenHolderWallet.publicKey());
    const traderAccount = await horizonServer.loadAccount(traderWallet.publicKey());

    console.log(`\n💰 Initial XLM balances:`);
    console.log(`   Asset Creator: ${assetCreatorAccount.balances[0].balance} XLM`);
    console.log(`   Token Holder: ${tokenHolderAccount.balances[0].balance} XLM`);
    console.log(`   Trader: ${traderAccount.balances[0].balance} XLM`);

    // ========================================
    // STEP 3: CREATE CUSTOM ASSET (RIO TOKEN)
    // ========================================
    console.log("\n🪙 STEP 3: Creating Custom Asset (RIO Token)");
    console.log("-".repeat(30));

    // Create the RIO asset - issued by the Asset Creator
    const RIO_ASSET = new Asset("RIO", assetCreatorWallet.publicKey());
    console.log(`🏗️  RIO Asset created:`);
    console.log(`   Asset Code: RIO`);
    console.log(`   Issuer: ${assetCreatorWallet.publicKey()}`);

    // ========================================
    // STEP 4: ESTABLISH TRUSTLINE FOR RIO ASSET
    // ========================================
    console.log("\n🤝 STEP 4: Creating Trustline for RIO Asset");
    console.log("-".repeat(30));

    // The Token Holder must create a trustline to receive RIO tokens
    console.log("📄 Creating trustline from Token Holder to RIO asset...");
    
    let tokenHolderAccountUpdated = await horizonServer.loadAccount(tokenHolderWallet.publicKey());
    
    const trustlineTransaction = new TransactionBuilder(tokenHolderAccountUpdated, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(Operation.changeTrust({
      asset: RIO_ASSET
    }))
    .setTimeout(30)
    .build();

    trustlineTransaction.sign(tokenHolderWallet);
    await horizonServer.submitTransaction(trustlineTransaction);
    console.log("✅ Trustline created successfully");

    // ========================================
    // STEP 5: ISSUE RIO TOKENS
    // ========================================
    console.log("\n🏭 STEP 5: Issuing RIO Tokens");
    console.log("-".repeat(30));

    // Issue 1,000,000 RIO tokens to the Token Holder
    const TOKEN_SUPPLY = "1000000"; // 1 million RIO tokens
    
    console.log(`💰 Issuing ${TOKEN_SUPPLY} RIO tokens to Token Holder...`);
    
    let assetCreatorAccountUpdated = await horizonServer.loadAccount(assetCreatorWallet.publicKey());
    
    const issueTokensTransaction = new TransactionBuilder(assetCreatorAccountUpdated, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(Operation.payment({
      destination: tokenHolderWallet.publicKey(),
      asset: RIO_ASSET,
      amount: TOKEN_SUPPLY
    }))
    .setTimeout(30)
    .build();

    issueTokensTransaction.sign(assetCreatorWallet);
    await horizonServer.submitTransaction(issueTokensTransaction);
    console.log("✅ RIO tokens issued successfully");

    // ========================================
    // STEP 6: REMOVE MINTING ABILITY (LOCK SUPPLY)
    // ========================================
    console.log("\n🔒 STEP 6: Removing Minting Ability");
    console.log("-".repeat(30));

    console.log("🚫 Setting Asset Creator account options to disable further minting...");
    
    assetCreatorAccountUpdated = await horizonServer.loadAccount(assetCreatorWallet.publicKey());
    
    const lockSupplyTransaction = new TransactionBuilder(assetCreatorAccountUpdated, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(Operation.setOptions({
      masterWeight: 0, // Remove ability to sign transactions
      lowThreshold: 1,
      medThreshold: 1,
      highThreshold: 1
    }))
    .setTimeout(30)
    .build();

    lockSupplyTransaction.sign(assetCreatorWallet);
    await horizonServer.submitTransaction(lockSupplyTransaction);
    console.log("✅ Asset Creator account locked - no more RIO tokens can be minted");

    // Check Token Holder balance
    tokenHolderAccountUpdated = await horizonServer.loadAccount(tokenHolderWallet.publicKey());
    console.log(`\n📊 Token Holder now holds:`);
    tokenHolderAccountUpdated.balances.forEach(balance => {
      if (balance.asset_type === 'native') {
        console.log(`   ${balance.balance} XLM`);
      } else {
        console.log(`   ${balance.balance} ${(balance as HorizonApi.BalanceLineAsset).asset_code}`);
      }
    });

    // ========================================
    // STEP 7: CREATE LIQUIDITY POOL (RIO/XLM)
    // ========================================
    console.log("\n🏊 STEP 7: Creating Liquidity Pool (RIO/XLM)");
    console.log("-".repeat(30));

    // Create XLM/RIO liquidity pool asset (XLM comes first lexicographically)
    const XLM_ASSET = Asset.native();
    const liquidityPoolAsset = new LiquidityPoolAsset(XLM_ASSET, RIO_ASSET, 30); // 0.30% fee
    const poolId = getLiquidityPoolId("constant_product", liquidityPoolAsset).toString('hex');
    
    console.log(`🏊 Creating XLM/RIO liquidity pool:`);
    console.log(`   Pool ID: ${poolId}`);
    console.log(`   Fee: 0.30%`);

    // Token Holder creates trustline to the liquidity pool
    console.log("🤝 Creating trustline to liquidity pool...");
    
    tokenHolderAccountUpdated = await horizonServer.loadAccount(tokenHolderWallet.publicKey());
    
    const poolTrustlineTransaction = new TransactionBuilder(tokenHolderAccountUpdated, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(Operation.changeTrust({
      asset: liquidityPoolAsset,
    }))
    .setTimeout(30)
    .build();

    poolTrustlineTransaction.sign(tokenHolderWallet);
    await horizonServer.submitTransaction(poolTrustlineTransaction);
    console.log("✅ Pool trustline created");

    // ========================================
    // STEP 8: DEPOSIT LIQUIDITY TO POOL
    // ========================================
    console.log("\n💧 STEP 8: Depositing Liquidity to Pool");
    console.log("-".repeat(30));

    // Deposit liquidity: 1000 XLM + 500,000 RIO (1 XLM = 500 RIO initial rate)
    const XLM_DEPOSIT = "1000";
    const RIO_DEPOSIT = "500000";
    
    console.log(`💰 Depositing liquidity:`);
    console.log(`   ${XLM_DEPOSIT} XLM`);
    console.log(`   ${RIO_DEPOSIT} RIO`);
    console.log(`   Initial rate: 1 XLM = 500 RIO`);

    tokenHolderAccountUpdated = await horizonServer.loadAccount(tokenHolderWallet.publicKey());
    
    const depositLiquidityTransaction = new TransactionBuilder(tokenHolderAccountUpdated, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(Operation.liquidityPoolDeposit({
      liquidityPoolId: poolId,
      maxAmountA: XLM_DEPOSIT, // XLM amount
      maxAmountB: RIO_DEPOSIT, // RIO amount
      minPrice: "0.0001",
      maxPrice: "10000"
    }))
    .setTimeout(30)
    .build();

    depositLiquidityTransaction.sign(tokenHolderWallet);
    await horizonServer.submitTransaction(depositLiquidityTransaction);
    console.log("✅ Liquidity deposited successfully");

    // Check pool balances
    tokenHolderAccountUpdated = await horizonServer.loadAccount(tokenHolderWallet.publicKey());
    console.log(`\n📊 Token Holder balances after liquidity deposit:`);
    tokenHolderAccountUpdated.balances.forEach(balance => {
      if (balance.asset_type === 'native') {
        console.log(`   ${balance.balance} XLM`);
      } else if (balance.asset_type === 'credit_alphanum4') {
        console.log(`   ${balance.balance} ${balance.asset_code}`);
      } else if (balance.asset_type === 'liquidity_pool_shares') {
        console.log(`   ${balance.balance} LP Shares`);
      }
    });

    // ========================================
    // STEP 9: TRADER SWAPS XLM FOR RIO
    // ========================================
    console.log("\n🔄 STEP 9: Trader Swaps XLM for RIO");
    console.log("-".repeat(30));

    // First, trader needs to create trustline to RIO
    console.log("🤝 Creating trustline from Trader to RIO asset...");
    
    let traderAccountUpdated = await horizonServer.loadAccount(traderWallet.publicKey());
    
    const traderTrustlineTransaction = new TransactionBuilder(traderAccountUpdated, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(Operation.changeTrust({
      asset: RIO_ASSET,
      limit: "1000000000"
    }))
    .setTimeout(30)
    .build();

    traderTrustlineTransaction.sign(traderWallet);
    await horizonServer.submitTransaction(traderTrustlineTransaction);
    console.log("✅ Trader trustline to RIO created");

    // Now perform the swap: 100 XLM for RIO tokens
    const SWAP_AMOUNT = "100";
    
    console.log(`🔄 Performing path payment:`);
    console.log(`   Sending: ${SWAP_AMOUNT} XLM`);
    console.log(`   Receiving: RIO tokens (market rate)`);
    console.log(`   Path: XLM → RIO (via liquidity pool)`);

    traderAccountUpdated = await horizonServer.loadAccount(traderWallet.publicKey());
    
    const pathPaymentTransaction = new TransactionBuilder(traderAccountUpdated, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(Operation.pathPaymentStrictSend({
      sendAsset: XLM_ASSET,
      sendAmount: SWAP_AMOUNT,
      destination: traderWallet.publicKey(),
      destAsset: RIO_ASSET,
      destMin: "1", // Minimum RIO to receive (very low for demo)
      path: [] // Direct swap through AMM
    }))
    .setTimeout(30)
    .build();

    pathPaymentTransaction.sign(traderWallet);
    await horizonServer.submitTransaction(pathPaymentTransaction);
    console.log("✅ Path payment executed successfully");

    // ========================================
    // STEP 10: FINAL RESULTS
    // ========================================
    console.log("\n🎉 STEP 10: Final Results");
    console.log("-".repeat(30));

    // Check final balances
    traderAccountUpdated = await horizonServer.loadAccount(traderWallet.publicKey());
    
    console.log(`\n📊 Final Trader balances:`);
    traderAccountUpdated.balances.forEach(balance => {
      if (balance.asset_type === 'native') {
        console.log(`   ${balance.balance} XLM`);
      } else if (balance.asset_type === 'credit_alphanum4') {
        console.log(`   ${balance.balance} ${balance.asset_code}`);
      }
    });

    // ========================================
    // WORKSHOP SUMMARY
    // ========================================
    console.log("\n" + "=".repeat(60));
    console.log("🎓 WORKSHOP SUMMARY");
    console.log("=".repeat(60));
    console.log("\n✨ What we accomplished:");
    console.log("   1. ✅ Created 3 wallets (Asset Creator, Token Holder, Trader)");
    console.log("   2. ✅ Created custom RIO asset");
    console.log("   3. ✅ Issued 1,000,000 RIO tokens");
    console.log("   4. ✅ Locked token supply (no more minting possible)");
    console.log("   5. ✅ Created XLM/RIO liquidity pool");
    console.log("   6. ✅ Deposited liquidity (1000 XLM + 500,000 RIO)");
    console.log("   7. ✅ Performed asset swap (XLM → RIO)");
    
    console.log("\n🔗 Important addresses:");
    console.log(`   RIO Asset: ${RIO_ASSET.code}:${RIO_ASSET.issuer}`);
    console.log(`   Liquidity Pool ID: ${poolId}`);
    console.log(`   Token Holder: ${tokenHolderWallet.publicKey()}`);
    console.log(`   Trader: ${traderWallet.publicKey()}`);
    
    console.log("\n🌟 Key learning points:");
    console.log("   • Custom assets require trustlines before receiving");
    console.log("   • Asset supply can be locked by setting issuer account options");
    console.log("   • Liquidity pools enable decentralized trading");
    console.log("   • Path payments can swap assets through pools");
    console.log("   • All transactions are recorded on the Stellar ledger");
    
    console.log("\n🚀 Workshop completed successfully!");
    console.log("Explore these assets on Stellar Expert: https://stellar.expert/explorer/testnet");

  } catch (error) {
    console.error("\n❌ Workshop Error:", error);
    if (error instanceof Error && 'response' in error) {
      const errorWithResponse = error as any;
      if (errorWithResponse.response && errorWithResponse.response.data) {
        console.error("🔍 Error details:", errorWithResponse.response.data);
      }
    }
  }
}

// Execute the workshop
stellarWorkshop();