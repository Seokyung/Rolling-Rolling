import React from "react";
import {
	HashRouter,
	Routes,
	Route,
	Navigate,
	BrowserRouter,
} from "react-router-dom";
import Navigation from "components/Navigation";
import Home from "./Home";
import Profile from "./Profile";
import Auth from "./Auth";
import PaperRouter from "./PaperRouter";

function AppRouter({ isLoggedIn, refreshUser }) {
	return (
		<BrowserRouter>
			<div>
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
			</div>
		</BrowserRouter>
	);
}

export default AppRouter;
