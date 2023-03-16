import React, { useEffect, useState } from "react";
import AppRouter from "routes/AppRouter";
import { authService } from "fbase";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);

	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}
		});
	}, []);

	return (
		<div>
			<AppRouter isLoggedIn={isLoggedIn} />
			<footer>
				&copy; {new Date().getFullYear()} Rolling-Rolling
				<br />
				Seokyung Jee
			</footer>
		</div>
	);
}

export default App;
