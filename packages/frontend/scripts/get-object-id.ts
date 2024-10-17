import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

const ownedObjects = await client.getOwnedObjects({
	owner: "0xec8ca60d8df8b33c736dcf63703a3926cef2f3d30c14dc9b96452f8eb465d7f1",
});

console.log(ownedObjects.data);

// curl --location 'https://sui-testnet.blastapi.io/0xec8ca60d8df8b33c736dcf63703a3926cef2f3d30c14dc9b96452f8eb465d7f1' \
// --header 'Content-Type: application/json' \
// --data '{
//   "jsonrpc": "2.0",
//   "id": 1,
//   "method": "sui_getObject",
//   "params": [
//     "0xf151233df41b5110d1e3d68bad0853b268f403a62ff5ec36a78aeaac25624f10",
//     {
//       "showType": true,
//       "showOwner": true,
//       "showPreviousTransaction": true,
//       "showDisplay": false,
//       "showContent": true,
//       "showBcs": false,
//       "showStorageRebate": true
//     }
//   ]
// }'

