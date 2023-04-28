import React from "react";
import {
	HashRouter,
	Routes,
	Route,
	Navigate,
	BrowserRouter,
} from "react-router-dom";
import Navigation from "routes/Navigation";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Auth from "../pages/Auth";
import Paper from "components/papers/Paper";
import PrivatePaper from "components/papers/PrivatePaper";
import EditPaper from "components/papers/EditPaper";

function AppRouter({ isLoggedIn, refreshUser }) {
	return (
		<BrowserRouter>
			<>
				{isLoggedIn ? (
					<>
						<Navigation />
						<Routes>
							<Route exact path="/" element={<Home />} />
							<Route
								exact
								path="/profile"
								element={<Profile refreshUser={refreshUser} />}
							/>
							<Route exact path="/paper/:paperId" element={<Paper />} />
							<Route
								exact
								path="/paper/private/:paperId"
								element={<PrivatePaper />}
							/>
							<Route
								exact
								path="/paper/edit/:paperId"
								element={<EditPaper />}
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
