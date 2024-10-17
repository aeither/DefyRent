import type { FC } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "~~/components/layout/Layout";
import GreetingForm from "~~/pages/GreetingForm";
import NetworkSupportChecker from "./components/NetworkSupportChecker";
import Hello from "./pages/Hello";

const App: FC = () => {
	return (
		<Layout>
			<NetworkSupportChecker />
			<Router>
				<Routes>
					<Route path="/" element={<GreetingForm />} />
					<Route path="/alpha" element={<Hello />} />
				</Routes>
			</Router>
		</Layout>
	);
};

export default App;
