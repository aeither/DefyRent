const apiKey = "L4zbvphDmQnzU3XqM63r";
const walletAddress =
	"0x978110b86146faa562d72a12131c5dc5021dd96d88e715c79d14fb9df0406c41";
const url = `https://api.blockeden.xyz/v1/eth/nft/owner/${walletAddress}`;

// curl -X 'GET' \
//   'https://api.blockeden.xyz/sui-indexer/jBQLBdEWG4xk6fmaWshS/account/nfts?account=0x978110b86146faa562d72a12131c5dc5021dd96d88e715c79d14fb9df0406c41' \
//   -H 'accept: application/json'

const options = {
	method: "GET",
	headers: {
		Authorization: `Bearer ${apiKey}`,
		"Content-Type": "application/json",
	},
};

fetch(url, options)
	.then(async (response) => {
		if (!response.ok) {
			const text = await response.text();
			throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
		}
		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			return response.json();
		} else {
			const text = await response.text();
			console.warn("Response is not JSON:", text);
			return null;
		}
	})
	.then((data) => {
		if (data) {
			console.log("NFTs owned by the wallet:", data);
		} else {
			console.log("No valid data received from the API");
		}
	})
	.catch((error) => {
		console.error("Error fetching NFTs:", error.message);
	});