import type React from "react";
import { useRef, useState } from "react";

const MediaUploader: React.FC = () => {
	const [inputString, setInputString] = useState("");
	const [uploadedString, setUploadedString] = useState("");
	const [retrievedString, setRetrievedString] = useState("");
	const [uploadedMedia, setUploadedMedia] = useState("");
	const [retrievedMedia, setRetrievedMedia] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleUpload = async () => {
		setIsLoading(true);
		setError("");
		try {
			const response = await fetch(
				"https://publisher.walrus-testnet.walrus.space/v1/store",
				{
					method: "PUT",
					body: inputString,
				},
			);

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const data = await response.json();
			setUploadedString(data.newlyCreated.blobObject.blobId);
		} catch (err) {
			setError(`Error uploading string: ${(err as Error).message}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRetrieve = async () => {
		if (!uploadedString) {
			setError("No string has been uploaded yet");
			return;
		}

		setIsLoading(true);
		setError("");
		try {
			const response = await fetch(
				`https://aggregator.walrus-testnet.walrus.space/v1/${uploadedString}`,
			);

			if (!response.ok) {
				throw new Error("Retrieval failed");
			}

			const data = await response.text();
			setRetrievedString(data);
		} catch (err) {
			setError(`Error retrieving string: ${(err as Error).message}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleMediaUpload = async () => {
		if (!fileInputRef.current?.files?.[0]) {
			setError("Please select a file to upload");
			return;
		}

		setIsLoading(true);
		setError("");
		try {
			const formData = new FormData();
			formData.append("file", fileInputRef.current.files[0]);

			const response = await fetch(
				"https://publisher.walrus-testnet.walrus.space/v1/store?epochs=5",
				{
					method: "PUT",
					body: formData,
				},
			);

			if (!response.ok) {
				throw new Error("Media upload failed");
			}

			const data = await response.json();
			setUploadedMedia(data.newlyCreated.blobObject.blobId);
		} catch (err) {
			setError(`Error uploading media: ${(err as Error).message}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleMediaRetrieve = async () => {
		if (!uploadedMedia) {
			setError("No media has been uploaded yet");
			return;
		}

		setIsLoading(true);
		setError("");
		try {
			const response = await fetch(
				`https://aggregator.walrus-testnet.walrus.space/v1/${uploadedMedia}`,
			);

			if (!response.ok) {
				throw new Error("Media retrieval failed");
			}

			// Set the retrieved media URL directly
			setRetrievedMedia(
				`https://aggregator.walrus-testnet.walrus.space/v1/${uploadedMedia}`,
			);
		} catch (err) {
			setError(`Error retrieving media: ${(err as Error).message}`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
			<h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
				String and Media Uploader
			</h1>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4 text-gray-700">
					String Upload and Retrieval
				</h2>
				<input
					type="text"
					value={inputString}
					onChange={(e) => setInputString(e.target.value)}
					placeholder="Enter string to upload"
					className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<div className="flex space-x-4">
					<button
						type="button"
						onClick={handleUpload}
						disabled={isLoading}
						className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
					>
						Upload String
					</button>
					<button
						type="button"
						onClick={handleRetrieve}
						disabled={isLoading || !uploadedString}
						className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
					>
						Retrieve String
					</button>
				</div>
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4 text-gray-700">
					Media Upload and Retrieval
				</h2>
				<input type="file" ref={fileInputRef} className="mb-4" />
				<div className="flex space-x-4">
					<button
						type="button"
						onClick={handleMediaUpload}
						disabled={isLoading}
						className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
					>
						Upload Media
					</button>
					<button
						type="button"
						onClick={handleMediaRetrieve}
						disabled={isLoading || !uploadedMedia}
						className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
					>
						Retrieve Media
					</button>
				</div>
			</div>

			{isLoading && (
				<div className="flex items-center justify-center mb-4">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
				</div>
			)}

			{error && <p className="text-red-500 mb-4">{error}</p>}

			{uploadedString && (
				<div className="mb-6 p-4 rounded-md">
					<h2 className="text-xl font-semibold mb-2 text-gray-700">
						Uploaded String ID:
					</h2>
					<p className="break-all">{uploadedString}</p>
				</div>
			)}

			{retrievedString && (
				<div className="mb-6 p-4 rounded-md">
					<h2 className="text-xl font-semibold mb-2 text-gray-700">
						Retrieved String:
					</h2>
					<p className="break-all">{retrievedString}</p>
				</div>
			)}

			{uploadedMedia && (
				<div className="mb-6 p-4 bg-gray-100 rounded-md">
					<h2 className="text-xl font-semibold mb-2 text-gray-700">
						Uploaded Media ID:
					</h2>
					<p className="break-all">{uploadedMedia}</p>
				</div>
			)}

			{retrievedMedia && (
				<div className="mb-6">
					<h2 className="text-xl font-semibold mb-2 text-gray-700">
						Retrieved Media:
					</h2>
					<img
						src={retrievedMedia}
						alt="Retrieved Media"
						className="max-w-full h-auto rounded-md shadow-md"
					/>
				</div>
			)}
		</div>
	);
};

export default MediaUploader;
