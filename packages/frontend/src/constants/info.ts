export const NFTInfo = {
	name: "WalrusRent #1234",
	description: "Decentralized Rent Deposit NFT for 123 Main St, Apt 4B",
	image: "ipfs://QmAbCdEfGhIjKlMnOpQrStUvWxYz1234567890",
	external_url: "https://walrusrent.com/nft/1234",
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
			checkInReport: "ipfs://QmZxCvYuLnOpQrStUvWxYz1234567890AbCdEfGhIj",
			lastInspectionDate: "2025-05-01",
			lastInspectionReport: "ipfs://QmNoPqRsTuVwXyZaBcDeFgHiJkLmNoPqRsTuVw",
		},
		disputeResolution: {
			arbitrator: "0x5678901234567890123456789012345678901234",
			resolutionMechanism: "Decentralized Arbitration Network",
		},
	},
};
