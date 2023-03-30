import React, { useState } from "react";
import CreatePaper from "components/papers/CreatePaper";
import PaperList from "components/papers/PaperList";
import "./styles/Home.css";

function Home({ userObj }) {
	const [paperModal, setPaperModal] = useState(false);

	const showPaperModal = () => {
		setPaperModal((prev) => !prev);
	};

	return (
		<div className="homeContainer">
			<h2>Home</h2>
			<button onClick={showPaperModal}>Paper 만들기</button>
			{paperModal && (
				<CreatePaper userObj={userObj} setPaperModal={setPaperModal} />
			)}
			<PaperList userObj={userObj} />
		</div>
	);
}

export default Home;
