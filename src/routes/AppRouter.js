import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";

function AppRouter() {
	return (
		<HashRouter>
			<div>
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route exact path="/profile" element={<Profile />} />
					<Route path="*" element={<Navigate to={"/"} />} />
				</Routes>
			</div>
		</HashRouter>
	);
}

export default AppRouter;
