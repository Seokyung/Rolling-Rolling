import React from "react";
import {
	HashRouter,
	Routes,
	Route,
	Navigate,
	BrowserRouter,
} from "react-router-dom";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Auth from "../pages/Auth";
import PaperRouter from "./PaperRouter";
import Navigation from "components/menu/Navigation";

function AppRouter({ isLoggedIn, refreshUser }) {
	return (
		<BrowserRouter>
			<>
				{isLoggedIn ? (
					<>
						<Navigation />
						<Routes>
							<Route exact path="/" element={<Home />} />
							<Route path="/paper/*" element={<PaperRouter />} />
							<Route
								exact
								path="/profile"
								element={<Profile refreshUser={refreshUser} />}
							/>
							<Route path="*" element={<Navigate to={"/"} />} />
						</Routes>
					</>
				) : (
					<>
						<Routes>
							<Route exact path="/" element={<Auth />} />
							<Route path="*" element={<Navigate to={"/"} />} />
						</Routes>
					</>
				)}
			</>
		</BrowserRouter>
	);
}

export default AppRouter;
