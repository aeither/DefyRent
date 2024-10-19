import {
    ConnectButton,
    useCurrentAccount,
    useSignAndExecuteTransaction,
    useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";
import { TESTNET_CONTRACT_PACKAGE_ID } from "~~/config/networks";

const DEPOSIT_AMOUNT = 100000000;

function Vault() {
	const [digest, setDigest] = useState("");
	const [vaultId, setVaultId] = useState("");
	const [vaultOwnerCapId, setVaultOwnerCapId] = useState("");
	const currentAccount = useCurrentAccount();
	const client = useSuiClient();

	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

	useEffect(() => {
		if (currentAccount) {
			fetchVaultAndCapIds();
		}
	}, [currentAccount]);

	const fetchVaultAndCapIds = async () => {
		if (!currentAccount) return;

		try {
			const objects = await client.getOwnedObjects({
				owner: currentAccount.address,
				options: { showOwner: true, showType: true },
			});

			console.log("Fetched objects:", objects);

			const vault = objects.data.find((obj) =>
				obj.data?.type?.includes("::vault::Vault"),
			);
			const vaultOwnerCap = objects.data.find((obj) =>
				obj.data?.type?.includes("::vault::VaultOwnerCap"),
			);

			console.log("Found vault:", vault);
			console.log("Found vaultOwnerCap:", vaultOwnerCap);

			if (vault && vault.data?.objectId) {
				const newVaultId = vault.data.objectId;
				console.log("Setting vaultId to:", newVaultId);
				setVaultId(newVaultId);
			} else {
				console.log("No valid Vault found");
				setVaultId("");
			}

			if (vaultOwnerCap && vaultOwnerCap.data?.objectId) {
				const newVaultOwnerCapId = vaultOwnerCap.data.objectId;
				console.log("Setting vaultOwnerCapId to:", newVaultOwnerCapId);
				setVaultOwnerCapId(newVaultOwnerCapId);
			} else {
				console.log("No valid VaultOwnerCap found");
				setVaultOwnerCapId("");
			}
		} catch (error) {
			console.error("Error fetching Vault and VaultOwnerCap IDs:", error);
			setVaultId("");
			setVaultOwnerCapId("");
		}
	};

	const handleCreateVault = async () => {
		if (!currentAccount) return;

		const txb = new Transaction();

		txb.moveCall({
			target: `${TESTNET_CONTRACT_PACKAGE_ID}::vault::create_vault`,
			arguments: [],
		});

		try {
			await signAndExecuteTransaction(
				{
					transaction: txb,
					chain: "sui:testnet",
				},
				{
					onSuccess: (result) => {
						console.log("Transaction successful", result);
						setDigest(result.digest);
						fetchVaultAndCapIds();
					},
					onError: (error) => {
						console.error("Transaction failed", error);
					},
				},
			);
		} catch (error) {
			console.error("Error executing transaction:", error);
		}
	};

	const handleDeposit = async () => {
		if (!currentAccount || !vaultId) {
			console.error("Cannot deposit: currentAccount or vaultId is missing");
			return;
		}

		const txb = new Transaction();
		txb.setGasBudget(DEPOSIT_AMOUNT);
        
		// Create a new coin object with the deposit amount
		const [coin] = txb.splitCoins(txb.gas, [DEPOSIT_AMOUNT]);

		txb.moveCall({
			target: `${TESTNET_CONTRACT_PACKAGE_ID}::vault::deposit`,
			arguments: [txb.object(vaultId), coin],
			typeArguments: ["0x2::sui::SUI"],
		});

		try {
			await signAndExecuteTransaction(
				{
					transaction: txb,
					chain: "sui:testnet",
				},
				{
					onSuccess: (result) => {
						console.log("Deposit executed", result);
						setDigest(result.digest);
					},
					onError: (error) => {
						console.error("Error executing deposit", error);
					},
				},
			);
		} catch (error) {
			console.error("Error executing transaction:", error);
		}
	};

	const handleWithdraw = () => {
		if (!currentAccount || !vaultId || !vaultOwnerCapId) {
			console.error(
				"Cannot withdraw: currentAccount, vaultId, or vaultOwnerCapId is missing",
			);
			return;
		}

		const txb = new Transaction();

		txb.moveCall({
			target: `${TESTNET_CONTRACT_PACKAGE_ID}::vault::withdraw`,
			arguments: [
				txb.object(vaultId),
				txb.object(vaultOwnerCapId),
				txb.pure.u64(DEPOSIT_AMOUNT),
			],
		});

		signAndExecuteTransaction(
			{
				transaction: txb,
				chain: "sui:testnet",
			},
			{
				onSuccess: (result) => {
					console.log("Withdrawal executed", result);
					setDigest(result.digest);
				},
				onError: (error) => {
					console.error("Error executing withdrawal", error);
				},
			},
		);
	};

	return (
		<div style={{ padding: 20 }}>
			<h1>Sui Vault dApp</h1>
			<ConnectButton />
			{currentAccount && (
				<>
					<div>
						<h2>Create Vault:</h2>
						<button type="button" onClick={handleCreateVault}>
							Create Vault
						</button>
					</div>
					<div>
						<h2>Deposit 0.1 SUI:</h2>
						<button type="button" onClick={handleDeposit} disabled={!vaultId}>
							Deposit
						</button>
					</div>
					<div>
						<h2>Withdraw 0.1 SUI:</h2>
						<button
							type="button"
							onClick={handleWithdraw}
							disabled={!vaultId || !vaultOwnerCapId}
						>
							Withdraw
						</button>
					</div>
					<div>Transaction Digest: {digest}</div>
					<div>Vault ID: {vaultId || "Not found"}</div>
					<div>VaultOwnerCap ID: {vaultOwnerCapId || "Not found"}</div>
				</>
			)}
		</div>
	);
}

export default Vault;
