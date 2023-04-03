import Paper from "components/papers/Paper";
import React from "react";
import { Route, Routes } from "react-router-dom";

function PaperRouter() {
	return (
		<Routes>
			<Route path=":paperId" element={<Paper />} />
		</Routes>
	);
}

export default PaperRouter;
