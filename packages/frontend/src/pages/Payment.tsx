import { useAccounts } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import type { SuiSignAndExecuteTransactionOutput } from "@mysten/wallet-standard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function PaymentPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();
	const [account] = useAccounts();

	const { transact } = useTransact({
		onSuccess: (data: SuiSignAndExecuteTransactionOutput) => {
			console.log("Transaction successful:", data);
			setShowModal(true);
		},
		onError: (e: Error) => {
			setError(`Error minting NFT: ${e.message}`);
		},
	});

	const uploadToWalrus = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(
				"https://walrus-publish-testnet.chainode.tech:9003/v1/store",
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
		const puppy = tx.moveCall({
			arguments: [tx.pure.string(name), tx.pure.string(url)],
			target: `${packageId}::nft::mint`,
		});

		tx.transferObjects([puppy], tx.pure.address(account.address));

		return tx;
	};

	const handlePayDeposit = async () => {
		try {
			const url = await uploadToWalrus();
			await transact(
				prepareTransaction(
					TESTNET_CONTRACT_PACKAGE_ID,
					"Rental Unit #2847",
					url,
				),
			);
		} catch (err) {
			console.error("Error during payment process:", err);
		}
	};

	const closeModalAndRedirect = () => {
		setShowModal(false);
		navigate("/");
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">
				{NFTInfo.name} - Deposit Payment
			</h1>
			<div className="shadow-md rounded-lg p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">Property Details</h2>
				<p>
					Address: {NFTInfo.properties.address.street},{" "}
					{NFTInfo.properties.address.unit}
				</p>
				<p>City: {NFTInfo.properties.address.city}</p>
				<p>
					Deposit Amount: {NFTInfo.properties.lease.depositAmount}{" "}
					{NFTInfo.properties.lease.depositCurrency}
				</p>
			</div>
			<button
				type="button"
				onClick={handlePayDeposit}
				disabled={isLoading}
				className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg w-full"
			>
				{isLoading ? "Processing..." : "Pay Deposit"}
			</button>
			<span>{account.address}</span>
			{error && <p className="error text-red-500 mt-4">{error}</p>}
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

export default PaymentPage;
