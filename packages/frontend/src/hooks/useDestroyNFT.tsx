import { useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { TESTNET_CONTRACT_PACKAGE_ID } from "~~/config/networks";
import useTransact from "./useTransact";

const useDestroyNFT = (objectId: string) => {
	const { transact } = useTransact();
	const account = useCurrentAccount();

	const prepareTransaction = (packageId: string, objectId: string) => {
		const tx = new Transaction();
		const puppy = tx.moveCall({
			arguments: [tx.object(objectId)],
			target: `${packageId}::nft::destroy`,
		});

		// tx.transferObjects([puppy], tx.pure.address(account.address));

		return tx;
	};
	const destroyNFT = async () => {
		try {
			if (!account) return;

			const result = await transact(
				prepareTransaction(TESTNET_CONTRACT_PACKAGE_ID, objectId),
			);

			return result;
		} catch (error) {
			console.error("Error destroying NFT:", error);
			return false;
		}
	};

	return destroyNFT;
};

export default useDestroyNFT;
