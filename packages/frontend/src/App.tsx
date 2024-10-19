import type { FC } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NetworkSupportChecker from "./components/NetworkSupportChecker";
import Layout from "./components/layout/Layout";
import Hello from "./pages/Hello";
import DefyRentHomepage from "./pages/Home";
// import Locker from "./pages/Locker";
import NFTList from "./pages/NFTList";
import PaymentPage from "./pages/Payment";
import Walrus from "./pages/Walrus";

const App: FC = () => {
	return (
		<Layout>
			<NetworkSupportChecker />
			<Router>
				<Routes>
					<Route path="/" element={<DefyRentHomepage />} />
					<Route path="/alpha" element={<Hello />} />
					<Route path="/walrus" element={<Walrus />} />
					<Route path="/payment" element={<PaymentPage />} />
					<Route path="/list" element={<NFTList />} />
					{/* <Route path="/locker" element={<Locker />} /> */}
				</Routes>
			</Router>
		</Layout>
	);
};

export default App;
