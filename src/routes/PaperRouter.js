import Paper from "components/papers/Paper";
import React from "react";
import { Route, Routes } from "react-router-dom";

function PaperRouter({ userObj }) {
	return (
		<Routes>
			<Route path=":paperId" element={<Paper userObj={userObj} />} />
		</Routes>
	);
}

export default PaperRouter;
