import type { FC } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "~~/components/layout/Layout";
import GreetingForm from "~~/pages/GreetingForm";
import NetworkSupportChecker from "./components/NetworkSupportChecker";
import Hello from "./pages/Hello";
import PaymentPage from "./pages/Payment";
import Walrus from "./pages/Walrus";

const App: FC = () => {
	return (
		<Layout>
			<NetworkSupportChecker />
			<Router>
				<Routes>
					<Route path="/" element={<GreetingForm />} />
					<Route path="/alpha" element={<Hello />} />
					<Route path="/walrus" element={<Walrus />} />
					<Route path="/payment" element={<PaymentPage />} />
				</Routes>
			</Router>
		</Layout>
	);
};

export default App;
