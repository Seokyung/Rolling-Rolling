import React, { useEffect, useState } from "react";
import AppRouter from "routes/AppRouter";
import { authService } from "api/fbase";
import "./App.css";

import { useDispatch } from "react-redux";
import { getUser } from "modules/app";

function App() {
	const dispatch = useDispatch();
	const [init, setInit] = useState(false);
	const [userObj, setUserObj] = useState(null);

	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				setUserObj({
					uid: user.uid,
					displayName: user.displayName
						? user.displayName
						: user.email.split("@")[0],
					photoURL: user.photoURL
						? user.photoURL
						: "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
				});
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
			} else {
				setUserObj(null);
			}
			setInit(true);
		});
	}, []);

	const refreshUser = () => {
		const user = authService.currentUser;
		setUserObj({
			uid: user.uid,
			displayName: user.displayName
				? user.displayName
				: user.email.split("@")[0],
			photoURL: user.photoURL
				? user.photoURL
				: "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
			updateProfile: (args) => user.updateProfile(args),
		});
	};

	return (
		<div>
			{init ? (
				<AppRouter
					isLoggedIn={Boolean(userObj)}
					userObj={userObj}
					refreshUser={refreshUser}
				/>
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
