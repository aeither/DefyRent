import { useCurrentAccount } from "@mysten/dapp-kit";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import type React from "react";
import { useEffect, useState } from "react";
import { TESTNET_CONTRACT_PACKAGE_ID } from "~~/config/networks";
import useDestroyNFT from "~~/hooks/useDestroyNFT";

type NFTMetadata = {
	name: string;
	description: string;
	image: string;
	external_url: string;
	attributes: Array<{
		trait_type: string;
		value: string | number;
		unit?: string;
	}>;
	properties: {
		address: {
			street: string;
			unit: string;
			city: string;
			state: string;
			country: string;
			postalCode: string;
		};
		renter: {
			name: string;
			walletAddress: string;
			email: string;
			phone: string;
		};
		landlord: {
			name: string;
			walletAddress: string;
			email: string;
			phone: string;
		};
		lease: {
			startDate: string;
			endDate: string;
			rentAmount: number;
			rentCurrency: string;
			paymentFrequency: string;
			depositAmount: number;
			depositCurrency: string;
		};
	};
};

type NFTData = {
	objectId: string;
	version: string;
	digest: string;
	type: string;
	display: {
		creator: string;
		description: string;
		image_url: string;
		name: string;
		project_url: string;
	};
	content: {
		dataType: string;
		type: string;
		hasPublicTransfer: boolean;
		fields: {
			id: {
				id: string;
			};
			name: string;
			url: string;
		};
	};
	metadata?: NFTMetadata;
};

const NFTCard: React.FC<{ nft: NFTData }> = ({ nft }) => {
	const destroyNFT = useDestroyNFT(nft.objectId);

	const handleClaimDeposit = async () => {
		const result = await destroyNFT();
		if (result) {
			console.log("Deposit claimed successfully");
			// You can add additional logic here, such as updating the UI or state
		} else {
			console.error("Failed to claim deposit");
		}
	};

	if (!nft.metadata) return null;

	return (
		<div className="bg-black/35 rounded-lg shadow-md overflow-hidden">
			<img
				src={nft.metadata.image}
				alt={nft.metadata.name}
				className="w-full h-48 object-cover"
			/>
			<div className="p-4">
				<h2 className="text-xl font-semibold mb-2">{nft.metadata.name}</h2>
				<p className="text-gray-600 mb-2">{nft.metadata.description}</p>
				<h3 className="text-lg font-semibold mt-4 mb-2">Property Details</h3>
				<p>
					Address:{" "}
					{`${nft.metadata.properties.address.street}, ${nft.metadata.properties.address.unit}, ${nft.metadata.properties.address.city}, ${nft.metadata.properties.address.state}, ${nft.metadata.properties.address.country}`}
				</p>
				<h3 className="text-lg font-semibold mt-4 mb-2">Lease Information</h3>
				<p>Start Date: {nft.metadata.properties.lease.startDate}</p>
				<p>End Date: {nft.metadata.properties.lease.endDate}</p>
				<p>
					Rent:{" "}
					{`${nft.metadata.properties.lease.rentAmount} ${nft.metadata.properties.lease.rentCurrency} (${nft.metadata.properties.lease.paymentFrequency})`}
				</p>
				<p>
					Deposit:{" "}
					{`${nft.metadata.properties.lease.depositAmount} ${nft.metadata.properties.lease.depositCurrency}`}
				</p>
				<h3 className="text-lg font-semibold mt-4 mb-2">Attributes</h3>
				<ul>
					{nft.metadata.attributes.map((attr, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<li key={index}>
							{`${attr.trait_type}: ${attr.value}${attr.unit ? ` ${attr.unit}` : ""}`}
						</li>
					))}
				</ul>
				<div className="mt-4 space-y-2">
					<a
						href={nft.metadata.external_url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 hover:underline block"
					>
						Download Rental Contract
					</a>
					<button
						type="button"
						onClick={handleClaimDeposit}
						className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
					>
						Claim Deposit
					</button>
				</div>
			</div>
		</div>
	);
};

const NFTList: React.FC = () => {
	const [nfts, setNfts] = useState<NFTData[]>([]);
	const account = useCurrentAccount();

	useEffect(() => {
		if (!account?.address) return;

		const fetchNFTs = async () => {
			const rpcUrl = getFullnodeUrl("testnet");
			const client = new SuiClient({ url: rpcUrl });

			try {
				const ownedObjects = await client.getOwnedObjects({
					owner: account.address,
					options: {
						showContent: true,
						showDisplay: true,
						showType: true,
					},
					filter: {
						StructType: `${TESTNET_CONTRACT_PACKAGE_ID}::nft::Rental`,
					},
				});

				const nftData = await Promise.all(
					ownedObjects.data.map(async (obj: any) => {
						const nft: NFTData = {
							objectId: obj.data.objectId,
							version: obj.data.version,
							digest: obj.data.digest,
							type: obj.data.type,
							display: obj.data.display?.data || {},
							content: obj.data.content,
						};

						try {
							const metadataResponse = await fetch(nft.display.image_url);
							const metadata: NFTMetadata = await metadataResponse.json();
							nft.metadata = metadata;
						} catch (error) {
							console.error("Error fetching NFT metadata:", error);
						}

						return nft;
					}),
				);

				setNfts(nftData);
			} catch (error) {
				console.error("Error fetching NFTs:", error);
			}
		};

		fetchNFTs();
	}, [account]);

	if (!account) {
		return <div>Please connect your wallet</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Rentals</h1>
			{nfts.length === 0 ? (
				<p>No NFTs found</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{nfts.map((nft) => (
						<NFTCard key={nft.objectId} nft={nft} />
					))}
				</div>
			)}
		</div>
	);
};

export default NFTList;
