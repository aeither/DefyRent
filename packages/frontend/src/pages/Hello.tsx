import {
    ConnectButton,
    useCurrentAccount,
    useSignAndExecuteTransaction,
    useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";

function Hello() {
	const [newMessage, setNewMessage] = useState("");
	const [currentMessage, setCurrentMessage] = useState("");
	const [digest, setDigest] = useState("");
	const currentAccount = useCurrentAccount();
	const client = useSuiClient();

	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
		execute: async ({ bytes, signature }) =>
			await client.executeTransactionBlock({
				transactionBlock: bytes,
				signature,
				options: {
					showRawEffects: true,
					showObjectChanges: true,
				},
			}),
	});

	const handleSetMessage = () => {
		if (!currentAccount) return;

		const txb = new Transaction();

		txb.moveCall({
			target:
				"0xec8ca60d8df8b33c736dcf63703a3926cef2f3d30c14dc9b96452f8eb465d7f1::message::set_message",
			arguments: [
				txb.object(
					"0xf151233df41b5110d1e3d68bad0853b268f403a62ff5ec36a78aeaac25624f10",
				),
				txb.pure.string(newMessage), // Specify the type as "string"
			],
		});

		signAndExecuteTransaction(
			{
				transaction: txb,
				chain: "sui:testnet",
			},
			{
				onSuccess: (result) => {
					console.log("Transaction executed", result);
					setDigest(result.digest);
					setCurrentMessage(newMessage);
					setNewMessage("");
				},
				onError: (error) => {
					console.error("Error executing transaction", error);
				},
			},
		);
	};

	return (
		<div style={{ padding: 20 }}>
			<h1>Sui Message dApp</h1>
			<ConnectButton />
			{currentAccount && (
				<>
					<div>
						<h2>Current Message:</h2>
						<p>{currentMessage}</p>
					</div>
					<div>
						<h2>Set New Message:</h2>
						<input
							type="text"
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							placeholder="Enter new message"
						/>
						<button type="button" onClick={handleSetMessage}>
							Set Message
						</button>
					</div>
					<div>Transaction Digest: {digest}</div>
				</>
			)}
		</div>
	);
}

export default Hello;
