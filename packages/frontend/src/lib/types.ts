
interface SuccessModalProps {
	transactionNumber: string;
	amount: number;
	paymentMethod: string;
	onClose: () => void;
}

type CertifiedData = {
	alreadyCertified: {
		blobId: string;
		eventOrObject: {
			Event: {
				txDigest: string;
				eventSeq: string;
			};
		};
		endEpoch: number;
	};
};

type BlobStorage = {
	id: string;
	startEpoch: number;
	endEpoch: number;
	storageSize: number;
};

type BlobObject = {
	id: string;
	registeredEpoch: number;
	blobId: string;
	size: number;
	encodingType: string;
	certifiedEpoch: number;
	storage: BlobStorage;
	deletable: boolean;
};

type ResourceOperation = {
	RegisterFromScratch: {
		encoded_length: number;
		epochs_ahead: number;
	};
};

type NewlyCreated = {
	blobObject: BlobObject;
	resourceOperation: ResourceOperation;
	cost: number;
};

type NewlyCreatedRoot = {
	newlyCreated: NewlyCreated;
};
