// import {
//     ConnectButton,
//     useCurrentAccount,
//     useSignAndExecuteTransaction,
//     useSuiClient,
// } from "@mysten/dapp-kit";
// import { Transaction } from "@mysten/sui/transactions";
// import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui/utils";
// import { useState } from "react";

// function Locker() {
// 	const [depositAmount, setDepositAmount] = useState("2000000000"); // 2 SUI in MIST
// 	const [withdrawAmount, setWithdrawAmount] = useState("2000000000"); // 2 SUI in MIST
// 	const [digest, setDigest] = useState("");
// 	const currentAccount = useCurrentAccount();
// 	const client = useSuiClient();

// 	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
// 		execute: async ({ bytes, signature }) =>
// 			await client.executeTransactionBlock({
// 				transactionBlock: bytes,
// 				signature,
// 				options: {
// 					showRawEffects: true,
// 					showObjectChanges: true,
// 				},
// 			}),
// 	});

// 	const handleDeposit = () => {
// 		if (!currentAccount) return;

// 		const txb = new Transaction();

// 		txb.moveCall({
// 			target: "0x<PACKAGE_ID>::deepbook::deposit",
// 			arguments: [
// 				txb.object("<POOL_ID>"), // Replace with your pool ID
// 				txb.splitCoins(txb.gas, [txb.pure.u64(depositAmount)]),
// 				txb.object(SUI_CLOCK_OBJECT_ID),
// 			],
// 		});

// 		signAndExecuteTransaction(
// 			{
// 				transaction: txb,
// 				chain: "sui:testnet",
// 			},
// 			{
// 				onSuccess: (result) => {
// 					console.log("Deposit executed", result);
// 					setDigest(result.digest);
// 				},
// 				onError: (error) => {
// 					console.error("Error executing deposit", error);
// 				},
// 			},
// 		);
// 	};

// 	const handleWithdraw = () => {
// 		if (!currentAccount) return;

// 		const txb = new Transaction();

// 		txb.moveCall({
// 			target: "0x<PACKAGE_ID>::deepbook::withdraw_base",
// 			arguments: [
// 				txb.object("<POOL_ID>"), // Replace with your pool ID
// 				txb.pure.u64(withdrawAmount),
// 				txb.object(SUI_CLOCK_OBJECT_ID),
// 			],
// 		});

// 		signAndExecuteTransaction(
// 			{
// 				transaction: txb,
// 				chain: "sui:testnet",
// 			},
// 			{
// 				onSuccess: (result) => {
// 					console.log("Withdrawal executed", result);
// 					setDigest(result.digest);
// 				},
// 				onError: (error) => {
// 					console.error("Error executing withdrawal", error);
// 				},
// 			},
// 		);
// 	};

// 	return (
// 		<div style={{ padding: 20 }}>
// 			<h1>Sui Deposit/Withdraw dApp</h1>
// 			<ConnectButton />
// 			{currentAccount && (
// 				<>
// 					<div>
// 						<h2>Deposit 2 SUI:</h2>
// 						<button type="button" onClick={handleDeposit}>
// 							Deposit
// 						</button>
// 					</div>
// 					<div>
// 						<h2>Withdraw 2 SUI:</h2>
// 						<button type="button" onClick={handleWithdraw}>
// 							Withdraw
// 						</button>
// 					</div>
// 					<div>Transaction Digest: {digest}</div>
// 				</>
// 			)}
// 		</div>
// 	);
// }

// export default Locker;