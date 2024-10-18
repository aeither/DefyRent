import { useState } from "react";
import { NFTInfo } from "~~/constants/info";

interface SuccessModalProps {
	transactionNumber: string;
	amount: number;
	paymentMethod: string;
	onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
	transactionNumber,
	amount,
	paymentMethod,
	onClose,
}) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
			<div className="bg-white p-8 rounded-lg text-center">
				<div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
					{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
					<svg
						className="w-8 h-8 text-white"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
				<p className="text-gray-600 mb-2">
					Transaction Number: {transactionNumber}
				</p>
				<p className="text-xl font-semibold mb-2">
					Amount paid: ${amount.toFixed(2)}
				</p>
				<p className="text-gray-600">Paid by {paymentMethod}</p>
				<button
					type="button"
					className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={onClose}
				>
					Close
				</button>
			</div>
		</div>
	);
};

function PaymentPage() {
	const [metadataUrl, setMetadataUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);

	const uploadToWalrus = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(
				"https://publisher.walrus-testnet.walrus.space/v1/store",
				{
					method: "PUT",
					body: JSON.stringify(NFTInfo),
				},
			);

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const data = await response.json();
			const blobId = data.newlyCreated.blobObject.blobId;
			const url = `https://aggregator.walrus-testnet.walrus.space/v1/${blobId}`;
			setMetadataUrl(url);
			console.log("Metadata URL:", url);
		} catch (err) {
			setError(`Error uploading NFT metadata: ${(err as Error).message}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePayment = () => {
		// Simulate payment process
		setTimeout(() => {
			setShowModal(true);
		}, 1000);
	};

	return (
		<div className="App">
			<h1 className="text-2xl font-bold mb-4">NFT Metadata Uploader</h1>
			<button
				type="button"
				onClick={uploadToWalrus}
				disabled={isLoading}
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
			>
				{isLoading ? "Uploading..." : "Upload NFT Metadata"}
			</button>
			<button
				type="button"
				onClick={handlePayment}
				className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
			>
				Pay
			</button>
			{error && <p className="error text-red-500 mt-2">{error}</p>}
			{metadataUrl && (
				<div className="mt-4">
					<h2 className="text-xl font-semibold">Metadata URL:</h2>
					<p className="break-all">{metadataUrl}</p>
				</div>
			)}
			{showModal && (
				<SuccessModal
					transactionNumber="123456789"
					amount={45.25}
					paymentMethod="Credit Card"
					onClose={() => setShowModal(false)}
				/>
			)}
		</div>
	);
}

export default PaymentPage;
