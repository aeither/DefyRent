import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { MultiSigPublicKey } from "@mysten/sui/multisig";
import { fromBase64 } from "@mysten/sui/utils";
import {
    getZkLoginSignature,
    toZkLoginPublicIdentifier,
} from "@mysten/sui/zklogin";

function decodeJwt(token: string) {
	const base64Url = token.split(".")[1];
	const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	return JSON.parse(atob(base64));
}

async function multiSigDemo() {
	// Step 1: Create keypairs
	const kp1 = new Ed25519Keypair();
	const kp2 = new Ed25519Keypair();
	const kp3 = new Ed25519Keypair();

	// Step 2: Create MultiSigPublicKey
	const multiSigPublicKey = MultiSigPublicKey.fromPublicKeys({
		threshold: 2,
		publicKeys: [
			{ publicKey: kp1.getPublicKey(), weight: 1 },
			{ publicKey: kp2.getPublicKey(), weight: 1 },
			{ publicKey: kp3.getPublicKey(), weight: 2 },
		],
	});

	const multisigAddress = multiSigPublicKey.toSuiAddress();
	console.log("Multisig Address:", multisigAddress);

	// Step 3: Combine signatures
	const message = new TextEncoder().encode("hello world");
	const signature1 = (await kp1.signPersonalMessage(message)).signature;
	const signature2 = (await kp2.signPersonalMessage(message)).signature;

	const combinedSignature = multiSigPublicKey.combinePartialSignatures([
		signature1,
		signature2,
	]);
	const isValid = await multiSigPublicKey.verifyPersonalMessage(
		message,
		combinedSignature,
	);
	console.log("Combined Signature Valid:", isValid);

	// Step 4: Create MultiSigSigner
	const signer = multiSigPublicKey.getSigner(kp1);
	const { signature } = await signer.signPersonalMessage(message);
	const isValidSigner = await multiSigPublicKey.verifyPersonalMessage(
		message,
		signature,
	);
	console.log("MultiSigSigner Signature Valid:", isValidSigner);

	// Step 5: Incorporate zkLogin
	const jwtToken = "a valid jwt token here";
	const decodedJWT = decodeJwt(jwtToken);
	const userSalt = BigInt("123"); // a valid user salt
	const addressSeed = genAddressSeed(
		userSalt,
		"sub",
		decodedJWT.sub,
		decodedJWT.aud,
	).toString();
	const pkZklogin = toZkLoginPublicIdentifier(addressSeed, decodedJWT.iss);

	// Create a new MultiSigPublicKey with zkLogin
	const multiSigPublicKeyWithZkLogin = MultiSigPublicKey.fromPublicKeys({
		threshold: 1,
		publicKeys: [
			{ publicKey: kp1.getPublicKey(), weight: 1 },
			{ publicKey: pkZklogin, weight: 1 },
		],
	});

	const multisigAddressWithZkLogin =
		multiSigPublicKeyWithZkLogin.toSuiAddress();
	console.log("Multisig Address with zkLogin:", multisigAddressWithZkLogin);

	// Simulate zkLogin signature (replace with actual implementation)
	const zkLoginInputs = {}; // Replace with actual zkLogin inputs
	const ephemeralSig = "base64EncodedEphemeralSignature"; // Replace with actual ephemeral signature
	const zkLoginSig = getZkLoginSignature({
		inputs: zkLoginInputs,
		maxEpoch: "2",
		userSignature: fromBase64(ephemeralSig),
	});

	// Combine zkLogin signature with MultiSigPublicKey
	const multisigWithZkLogin =
		multiSigPublicKeyWithZkLogin.combinePartialSignatures([zkLoginSig]);
	console.log("Multisig with zkLogin Signature:", multisigWithZkLogin);

	// Example of a more complex multisig setup
	const complexMultiSigPublicKey = MultiSigPublicKey.fromPublicKeys({
		threshold: 2,
		publicKeys: [
			{
				publicKey: toZkLoginPublicIdentifier(
					"charlieGoogleSeed",
					"https://accounts.google.com",
				),
				weight: 2,
			},
			{
				publicKey: toZkLoginPublicIdentifier(
					"aliceAppleSeed",
					"https://appleid.apple.com",
				),
				weight: 1,
			},
			{
				publicKey: toZkLoginPublicIdentifier(
					"bobFacebookSeed",
					"https://www.facebook.com",
				),
				weight: 1,
			},
		],
	});

	const complexMultisigAddress = complexMultiSigPublicKey.toSuiAddress();
	console.log("Complex Multisig Address:", complexMultisigAddress);
}

multiSigDemo().catch(console.error);