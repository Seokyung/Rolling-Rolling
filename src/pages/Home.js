import React, { useState } from "react";
import CreatePaper from "components/papers/CreatePaper";
import PaperList from "components/papers/PaperList";
import { PC, Mobile, Tablet } from "components/mediaQuery";
import "./Home.css";

function Home() {
	const [paperModal, setPaperModal] = useState(false);

	const showPaperModal = () => {
		setPaperModal((prev) => !prev);
	};

	return (
		<>
			<PC>
				<div className="homeContainerDesktop">
					<h2>Home</h2>
					<button onClick={showPaperModal}>Paper 만들기</button>
					{paperModal && <CreatePaper setPaperModal={setPaperModal} />}
					<PaperList />
				</div>
			</PC>

			<Tablet>
				<div className="homeContainerTablet">
					<h2>Home</h2>
					<button onClick={showPaperModal}>Paper 만들기</button>
					{paperModal && <CreatePaper setPaperModal={setPaperModal} />}
					<PaperList />
				</div>
			</Tablet>

			<Mobile>
				<div className="homeContainerMobile">
					<h2>Home</h2>
					<button onClick={showPaperModal}>Paper 만들기</button>
					{paperModal && <CreatePaper setPaperModal={setPaperModal} />}
					<PaperList />
				</div>
			</Mobile>
		</>
	);
}

export default Home;
