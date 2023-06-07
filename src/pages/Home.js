import React, { useState } from "react";
import CreatePaper from "components/papers/CreatePaper";
import PaperList from "components/papers/PaperList";

import { Button } from "react-bootstrap";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";

function Home() {
	const [paperModal, setPaperModal] = useState(false);

	const [messageApi, contextHolder] = message.useMessage();

	const openPaperModal = () => {
		setPaperModal(true);
	};

	return (
		<>
			{contextHolder}
			<div className="home-container">
				<div className="home-paper-container">
					<div className="home-title-container">
						<h2 className="home-title">내 페이퍼 목록</h2>
					</div>
					<PaperList />
				</div>
				<Button className="paper-creating-btn" onClick={openPaperModal}>
					<FontAwesomeIcon
						className="paper-creating-btn-icon"
						icon={faFileCirclePlus}
					/>
					페이퍼 만들기
				</Button>
			</div>
			<CreatePaper
				paperModal={paperModal}
				setPaperModal={setPaperModal}
				messageApi={messageApi}
			/>
		</>
	);
}

export default Home;
