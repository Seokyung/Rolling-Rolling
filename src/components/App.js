import React, { useState } from "react";
import AppRouter from "routes/AppRouter";
import { authService } from "fbase";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);

	return (
		<div>
			<div>
				<AppRouter isLoggedIn={isLoggedIn} />
			</div>
			<footer>
				&copy; {new Date().getFullYear()} Rolling-Rolling
				<br />
				Seokyung Jee
			</footer>
		</div>
	);
}

export default App;
