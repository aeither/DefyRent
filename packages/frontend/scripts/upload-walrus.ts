// https://publisher.walrus-testnet.walrus.space/v1/store
// https://wal-publisher-testnet.staketab.org/v1/store
fetch("http://walrus-testnet.stakingdefenseleague.com:9001/v1/store", {
	method: "PUT",
	body: "some other string",
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
 * http://walrus-testnet.stakingdefenseleague.com:9000/v1/MlJ2y4tENbvFjbPVU3MN5nuBlx9tcwDASZheJ_K24MU
 */
