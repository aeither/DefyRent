import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

// use getFullnodeUrl to define Devnet RPC location
const rpcUrl = getFullnodeUrl("testnet");

// create a client connected to devnet
const client = new SuiClient({ url: rpcUrl });

// get coins owned by an address
async function main() {
	const ownedObjects = await client.getOwnedObjects({
		owner: "0x978110b86146faa562d72a12131c5dc5021dd96d88e715c79d14fb9df0406c41",
		options: {
			showContent: true,
			showDisplay: true,
			showType: true,
		},
		filter: {
			StructType:
				"0x23541b1f99e1e459f78cf675fc2974a60355ac62a35289c7b59bc835adff785b::nft::Rental",
		},
	});
	console.log(ownedObjects.data);
	console.log("content: ", ownedObjects.data[1].data?.content);
	console.log("display: ", ownedObjects.data[1].data?.display);
}
main();
