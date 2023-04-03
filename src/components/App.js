import React, { useEffect, useState } from "react";
import AppRouter from "routes/AppRouter";
import { authService } from "api/fbase";
import "./App.css";

import { useDispatch } from "react-redux";
import { getUser } from "modules/user";

function App() {
	const dispatch = useDispatch();
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const getUserDispatch = (user) => {
		dispatch(
			getUser({
				uid: user.uid,
				displayName: user.displayName
					? user.displayName
					: user.email.split("@")[0],
				photoURL: user.photoURL
					? user.photoURL
					: "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
			})
		);
	};

	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
				getUserDispatch(user);
			} else {
				setIsLoggedIn(false);
				dispatch(
					getUser({
						uid: "",
						displayName: "",
						photoURL: "",
					})
				);
			}
			setInit(true);
		});
	}, []);

	const refreshUser = () => {
		const user = authService.currentUser;
		getUserDispatch(user);
	};

	return (
		<div>
			{init ? (
				<AppRouter isLoggedIn={isLoggedIn} refreshUser={refreshUser} />
			) : (
				"Initializing..."
			)}
			<footer className="appFooter">
				&copy; {new Date().getFullYear()} Rolling-Rolling
				<br />
				Seokyung Jee
			</footer>
		</div>
	);
}

export default App;
