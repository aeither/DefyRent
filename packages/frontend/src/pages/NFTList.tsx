import { useCurrentAccount } from "@mysten/dapp-kit";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import type React from "react";
import { useEffect, useState } from "react";
import { TESTNET_CONTRACT_PACKAGE_ID } from "~~/config/networks";

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

				const nftData = ownedObjects.data.map((obj: any) => ({
					objectId: obj.data.objectId,
					version: obj.data.version,
					digest: obj.data.digest,
					type: obj.data.type,
					display: obj.data.display?.data || {},
					content: obj.data.content,
				}));

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
						<div
							key={nft.objectId}
							className="bg-white rounded-lg shadow-md overflow-hidden"
						>
							<img
								src={nft.display.image_url}
								alt={nft.display.name}
								className="w-full h-48 object-cover"
							/>
							<div className="p-4">
								<h2 className="text-xl font-semibold mb-2">
									{nft.display.name}
								</h2>
								<p className="text-gray-600 mb-2">{nft.display.description}</p>
								<p className="text-sm text-gray-500">
									Creator: {nft.display.creator}
								</p>
								<a
									href={nft.display.project_url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 hover:underline"
								>
									Project URL
								</a>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default NFTList;
