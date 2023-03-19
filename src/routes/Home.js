import React, { useState } from "react";
import CreatePaper from "components/papers/CreatePaper";
import Paper from "components/papers/Paper";

function Home() {
	//const [papers, setPapers] = useState([]);
	const [paperModal, setPaperModal] = useState(false);

	const showPaperModal = () => {
		setPaperModal((prev) => !prev);
	};

	return (
		<div>
			<h2>Home</h2>
			<button onClick={showPaperModal}>Paper 만들기</button>
			{paperModal && <CreatePaper />}
			<Paper />
			{/* <div>
				{papers.map((paper) => (
					<Paper />
				))}
			</div> */}
		</div>
	);
}

export default Home;
