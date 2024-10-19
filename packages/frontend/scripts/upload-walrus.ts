// https://publisher.walrus-testnet.walrus.space/v1/store
// https://wal-publisher-testnet.staketab.org/v1/store

export const NFTInfo = {
	name: "WalrusRent #5379",
	description: "Decentralized Rent Deposit NFT for 123 Main St, Apt 4B",
	image:
		"https://walrus-agg-testnet.chainode.tech:9002/v1/wSqp_roMTUfQ1z0XaBxDf3zFSnysTqNCrsAXdKl8yhg",
	external_url:
		"https://walrus-agg-testnet.chainode.tech:9002/v1/MlJ2y4tENbvFjbPVU3MN5nuBlx9tcwDASZheJ_K24MU",
	attributes: [
		{
			trait_type: "Property Type",
			value: "Apartment",
		},
		{
			trait_type: "Bedrooms",
			value: 2,
		},
		{
			trait_type: "Bathrooms",
			value: 1,
		},
		{
			trait_type: "Floor Area",
			value: 75,
			unit: "m²",
		},
		{
			trait_type: "Furnished",
			value: "Yes",
		},
		{
			trait_type: "Pets Allowed",
			value: "No",
		},
	],
	properties: {
		address: {
			street: "123 Main St",
			unit: "Apt 4B",
			city: "Cryptoville",
			state: "Blockchain",
			country: "Decentraland",
			postalCode: "12345",
		},
		renter: {
			name: "Alice Nakamoto",
			walletAddress: "0x1234567890123456789012345678901234567890",
			email: "alice@example.com",
			phone: "+1 (555) 123-4567",
		},
		landlord: {
			name: "Bob Buterin",
			walletAddress: "0x0987654321098765432109876543210987654321",
			email: "bob@example.com",
			phone: "+1 (555) 987-6543",
		},
		lease: {
			startDate: "2024-11-01",
			endDate: "2025-10-31",
			rentAmount: 600,
			rentCurrency: "SUI",
			paymentFrequency: "Monthly",
			depositAmount: 3000,
			depositCurrency: "SUI",
		},
		propertyCondition: {
			checkInDate: "2024-11-01",
			checkInReport:
				"https://aggregator.walrus-testnet.walrus.space/v1/wSqp_roMTUfQ1z0XaBxDf3zFSnysTqNCrsAXdKl8yhg",
			lastInspectionDate: "2025-05-01",
			lastInspectionReport:
				"https://aggregator.walrus-testnet.walrus.space/v1/wSqp_roMTUfQ1z0XaBxDf3zFSnysTqNCrsAXdKl8yhg",
		},
		disputeResolution: {
			arbitrator:
				"https://aggregator.walrus-testnet.walrus.space/v1/wSqp_roMTUfQ1z0XaBxDf3zFSnysTqNCrsAXdKl8yhg",
			resolutionMechanism: "Decentralized Arbitration Network",
		},
	},
};


fetch("http://walrus-testnet.stakingdefenseleague.com:9001/v1/store", {
	method: "PUT",
	body: JSON.stringify(NFTInfo),
})
	.then((response) => {
		if (!response.ok) {
			throw new Error("Upload failed");
		}
		return response.text();
	})
	.then((data) => {
		console.log(data);
	})
	.catch((error) => {
		console.error(error);
	});

// https://aggregator.walrus-testnet.walrus.space/v1/y1GuyqLZ6IhZGHvHnoSKGQVexrTD6vqssfHxkTrs9cc

/**
 * curl -X PUT "http://walrus-testnet.stakingdefenseleague.com:9001/v1/store" -d "some other string"
 */

/**
 * retrieving content
 * http://walrus-testnet.stakingdefenseleague.com:9000/v1/y1GuyqLZ6IhZGHvHnoSKGQVexrTD6vqssfHxkTrs9cc
 * 
 * pdf
 * http://walrus-testnet.stakingdefenseleague.com:9000/v1/MlJ2y4tENbvFjbPVU3MN5nuBlx9tcwDASZheJ_K24MU
 */
