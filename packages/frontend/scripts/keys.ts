import { SuiClient } from "@mysten/sui/client";
import { requestSuiFromFaucetV0 } from "@mysten/sui/faucet";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";

async function faucetWallet() {
	// Create a new Ed25519Keypair
	const kp2 = new Ed25519Keypair();

	const privateKey = kp2.getSecretKey();

	console.log("Private Key:", privateKey);
	// Get the address of the keypair
	const address = kp2.getPublicKey().toSuiAddress();

	console.log("Wallet Address:", address);

	// Create a SuiClient instance (use the appropriate network)
	const client = new SuiClient({ url: "https://fullnode.testnet.sui.io" });

	try {
		// Request tokens from the faucet
		const result = await requestSuiFromFaucetV0({
			host: "https://faucet.testnet.sui.io/gas",
			recipient: address,
		});

		console.log("Faucet Result:", result);
	} catch (error) {
		console.error("Error fauceting wallet:", error);
	}
}

async function sendAllSui(privateKey: string, recipientAddress: string) {
	// Recreate the keypair from the private key
	const keypair = Ed25519Keypair.fromSecretKey(privateKey);
	const senderAddress = keypair.getPublicKey().toSuiAddress();

	// Create a SuiClient instance
	const client = new SuiClient({ url: "https://fullnode.testnet.sui.io" });

	try {
		// Create a new transaction block
		const tx = new Transaction();

		// Merge all SUI coins
		const [mergedCoin] = tx.splitCoins(tx.gas, [100000000]);
		// for (const coin of suiCoins) {
		// 	tx.mergeCoins(mergedCoin, tx.object(coin.data!.objectId));
		// }

		// Transfer all SUI to the recipient
		tx.transferObjects([mergedCoin], tx.pure.address(recipientAddress));

		// Sign and execute the transaction
		const result = await client.signAndExecuteTransaction({
			signer: keypair,
			transaction: tx,
		});

		console.log("Transaction Result:", result);
		console.log("All SUI sent successfully to", recipientAddress);
	} catch (error) {
		console.error("Error sending SUI:", error);
	}
}

// Example usage
async function main() {
	// await faucetWallet();

	// Replace with the actual private key and recipient address
	const privateKey =
		"";
	const recipientAddress =
		"0x978110b86146faa562d72a12131c5dc5021dd96d88e715c79d14fb9df0406c41";

	await sendAllSui(privateKey, recipientAddress);
}

main();
