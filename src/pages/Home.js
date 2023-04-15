import React, { useState } from "react";
import CreatePaper from "components/papers/CreatePaper";
import PaperList from "components/papers/PaperList";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";

function Home() {
	const [paperModal, setPaperModal] = useState(false);

	const openPaperModal = () => {
		setPaperModal(true);
	};

	return (
		<>
			<div className="home-container">
				<div className="home-paper-container">
					<PaperList />
				</div>
				<button className="home-paper-btn" onClick={openPaperModal}>
					<FontAwesomeIcon icon={faPlus} />
					페이퍼 만들기
				</button>
			</div>
			<CreatePaper paperModal={paperModal} setPaperModal={setPaperModal} />
		</>
	);
}

export default Home;
