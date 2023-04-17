import React, { useEffect, useState } from "react";
import AppRouter from "routes/AppRouter";
import { authService } from "api/fbase";

import { useDispatch } from "react-redux";
import { getUser } from "modules/user";
import Footer from "./footer/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScroll } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function App() {
	const dispatch = useDispatch();
	const [init, setInit] = useState(true);
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
			setInit(false);
		});
	}, []);

	const refreshUser = () => {
		const user = authService.currentUser;
		getUserDispatch(user);
	};

	return (
		<div>
			{init ? (
				<div className="app-init-container">
					<FontAwesomeIcon className="app-init-icon" icon={faScroll} spin />
				</div>
			) : (
				<AppRouter isLoggedIn={isLoggedIn} refreshUser={refreshUser} />
			)}
			<Footer />
		</div>
	);
}

export default App;
