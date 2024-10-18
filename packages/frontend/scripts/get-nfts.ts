import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

// use getFullnodeUrl to define Devnet RPC location
const rpcUrl = getFullnodeUrl("testnet");

// create a client connected to devnet
const client = new SuiClient({ url: rpcUrl });

// get coins owned by an address
// replace <OWNER_ADDRESS> with actual address in the form of 0x123...
async function main() {
	const ownedObjects = await client.getOwnedObjects({
		owner: "0x978110b86146faa562d72a12131c5dc5021dd96d88e715c79d14fb9df0406c41",
        options: {
            showContent: true,
            showDisplay: true,
            showType: true
        }
		// filter: {
		//     Package
		// }
	});
	console.log(ownedObjects.data);
	console.log("content: ", ownedObjects.data[1].data?.content);
	console.log("display: ", ownedObjects.data[1].data?.display);

	// if (ownedObjects.data[0].data) {
	// 	const object = await client.getObject({
	// 		id: ownedObjects.data[0].data.objectId,
    //         options: {}
	// 	});
	// 	console.log("🚀 ~ main ~ object:", object)
	// }
}

main();
