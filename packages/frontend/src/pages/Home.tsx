import { Button, Card } from "@radix-ui/themes";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~~/components/ui/card";

export default function DefyRentHomepage() {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<main className="flex-grow container mx-auto px-4 py-12">
				<div className="max-w-4xl mx-auto text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Decentralized Rental Deposits
					</h1>
					<p className="text-xl text-gray-600 mb-8">
						Secure, transparent, and trustless deposit management for the modern
						rental market.
					</p>
					<Button className="bg-purple-600 hover:bg-purple-700 text-white">
						Get Started
					</Button>
				</div>

				<Card className="max-w-2xl mx-auto">
					<CardHeader>
						<CardTitle className="text-2xl">
							Blockchain-Powered Deposit Protection
						</CardTitle>
						<CardDescription>
							Revolutionizing rental agreements with smart contracts
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							<li className="flex items-center">
								{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									className="w-5 h-5 mr-2 text-green-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								Decentralized and tamper-proof ledger
							</li>
							<li className="flex items-center">
								{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									className="w-5 h-5 mr-2 text-green-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								Smart contract-based agreements
							</li>
							<li className="flex items-center">
								{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									className="w-5 h-5 mr-2 text-green-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								Automated and instant dispute resolution
							</li>
						</ul>
					</CardContent>
					<CardFooter>
						<Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
							Secure Your Deposit
						</Button>
					</CardFooter>
				</Card>
			</main>

			<footer className="py-6 px-8 bg-gray-100">
				<div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
					© {new Date().getFullYear()} DefyRent. Empowering decentralized
					rentals.
				</div>
			</footer>
		</div>
	);
}
