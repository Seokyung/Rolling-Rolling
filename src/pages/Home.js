import React, { useState } from "react";
import CreatePaper from "components/papers/CreatePaper";
import PaperList from "components/papers/PaperList";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";

function Home() {
	const [paperModal, setPaperModal] = useState(false);

	const showPaperModal = () => {
		setPaperModal((prev) => !prev);
	};

	return (
		<div className="home-container">
			<div className="home-paper-container">
				{paperModal && <CreatePaper setPaperModal={setPaperModal} />}
				<PaperList />
			</div>
			<button className="home-paper-btn" onClick={showPaperModal}>
				<FontAwesomeIcon icon={faPlus} />
				페이퍼 만들기
			</button>
		</div>
	);
}

export default Home;
