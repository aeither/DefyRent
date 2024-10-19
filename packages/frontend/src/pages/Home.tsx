import { useAccounts } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import type { SuiSignAndExecuteTransactionOutput } from "@mysten/wallet-standard";
import { Button, Card } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~~/components/ui/card";
import { TESTNET_CONTRACT_PACKAGE_ID } from "~~/config/networks";
import { NFTInfo } from "~~/constants/info";
import useTransact from "~~/hooks/useTransact";

const SuccessModal: React.FC<SuccessModalProps> = ({
	transactionNumber,
	amount,
	paymentMethod,
	onClose,
}) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
			<div className="p-8 rounded-lg bg-white text-center shadow-lg max-w-md w-full">
				<div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg
						className="w-8 h-8 text-white"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<h2 className="text-2xl font-bold mb-4 text-gray-800">
					Payment Successful
				</h2>
				<p className="text-gray-700 mb-2">
					Transaction Number:{" "}
					<span className="font-medium">{transactionNumber}</span>
				</p>
				<p className="text-xl font-semibold mb-2 text-gray-800">
					Amount paid: {amount.toFixed(2)} SUI
				</p>
				<p className="text-gray-700 mb-6">Paid with {paymentMethod}</p>
				<button
					type="button"
					className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
					onClick={onClose}
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default function DefyRentHomepage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();
	const [account] = useAccounts();

	const uploadToWalrus = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(
				"http://walrus-testnet.stakingdefenseleague.com:9001/v1/store",
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(NFTInfo),
				},
			);

			if (!response.ok) {
				throw new Error(`Upload failed: ${response.statusText}`);
			}

			const data: CertifiedData | NewlyCreatedRoot = await response.json();
			console.log("🚀 ~ uploadToWalrus ~ data:", data);

			let blobId: string;

			if ("alreadyCertified" in data && data.alreadyCertified.blobId) {
				blobId = data.alreadyCertified.blobId;
			} else if (
				"newlyCreated" in data &&
				data.newlyCreated.blobObject &&
				data.newlyCreated.blobObject.blobId
			) {
				blobId = data.newlyCreated.blobObject.blobId;
			} else {
				throw new Error("Unexpected response format from Walrus API");
			}

			const url = `https://aggregator.walrus-testnet.walrus.space/v1/${blobId}`;
			console.log("Metadata URL:", url);
			return url;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			setError(`Error uploading NFT metadata: ${errorMessage}`);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const prepareTransaction = (packageId: string, name: string, url: string) => {
		const tx = new Transaction();

		// retrive from somewhere = getOwnObject with the client query
		// retrive from somewhere = getOwnObject with address as param, filter by type "0x5188692189546dddf5a6032e0692a6502714705e3db9274d8bb7ef2682c098d6::message::Message"

		// tx.moveCall({
		// arguments: [admin, ]
		// target:::nft:take_profit
		//  });

		const puppy = tx.moveCall({
			arguments: [tx.pure.string(name), tx.pure.string(url)],
			target: `${packageId}::nft::mint`,
		});

		tx.transferObjects([puppy], tx.pure.address(account.address));

		return tx;
	};

	const { transact } = useTransact({
		onSuccess: (data: SuiSignAndExecuteTransactionOutput) => {
			console.log("Transaction successful:", data);
			setShowModal(true);
		},
		onError: (e: Error) => {
			setError(`Error minting NFT: ${e.message}`);
		},
	});

	const handlePayDeposit = async () => {
		try {
			const url = await uploadToWalrus();
			await transact(
				prepareTransaction(TESTNET_CONTRACT_PACKAGE_ID, NFTInfo.name, url),
			);
		} catch (err) {
			console.error("Error during payment process:", err);
		}
	};

	const closeModalAndRedirect = () => {
		setShowModal(false);
		navigate("/list");
	};

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-grow container mx-auto px-4 py-12">
				<div className="max-w-4xl mx-auto text-center mb-12">
					<h1 className="text-4xl font-bold mb-4">
						Secure Your Rental Deposit
					</h1>
					<p className="text-xl mb-8">
						Complete your deposit payment for {NFTInfo.name} using our
						decentralized platform.
					</p>
				</div>

				<Card className="max-w-2xl mx-auto">
					<CardHeader>
						<CardTitle className="text-2xl">Property Details</CardTitle>
						<CardDescription>
							Review and confirm your deposit information
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							<li>
								Address: {NFTInfo.properties.address.street},{" "}
								{NFTInfo.properties.address.unit}
							</li>
							<li>City: {NFTInfo.properties.address.city}</li>
							<li>
								Deposit Amount: {NFTInfo.properties.lease.depositAmount}{" "}
								{NFTInfo.properties.lease.depositCurrency}
							</li>
						</ul>
					</CardContent>
					<CardFooter>
						<Button
							onClick={handlePayDeposit}
							disabled={isLoading}
							className="w-full bg-purple-600 hover:bg-purple-700 text-white"
						>
							{isLoading ? "Processing..." : "Pay Deposit"}
						</Button>
					</CardFooter>
				</Card>

				{error && (
					<p className="error text-red-500 mt-4 text-center">{error}</p>
				)}
			</main>

			<footer className="py-6 px-8">
				<div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
					© {new Date().getFullYear()} DefyRent. Empowering decentralized
					rentals.
				</div>
			</footer>

			{showModal && (
				<SuccessModal
					transactionNumber="123456789"
					amount={NFTInfo.properties.lease.depositAmount}
					paymentMethod={NFTInfo.properties.lease.depositCurrency}
					onClose={closeModalAndRedirect}
				/>
			)}
		</div>
	);
}
