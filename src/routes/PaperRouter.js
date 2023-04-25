import React from "react";
import { Route, Routes } from "react-router-dom";
import Paper from "components/papers/Paper";
import EditPaper from "components/papers/EditPaper";

function PaperRouter() {
	return (
		<Routes>
			<Route path=":paperId" element={<Paper />} />
			<Route path="edit/:paperId" element={<EditPaper />} />
		</Routes>
	);
}

export default PaperRouter;
