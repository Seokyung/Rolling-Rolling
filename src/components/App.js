import React from "react";
import AppRouter from "routes/AppRouter";

function App() {
	return (
		<div>
			<div>
				<AppRouter />
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
