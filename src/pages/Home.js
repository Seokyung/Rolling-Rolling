import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CreatePaper from "components/papers/CreatePaper";
import PaperList from "components/papers/PaperList";

import { Button } from "react-bootstrap";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";

function Home() {
	const userName = useSelector((state) => state.userReducer.displayName);
	const profileImg = useSelector((state) => state.userReducer.photoURL);
	const [paperModal, setPaperModal] = useState(false);

	const [messageApi, contextHolder] = message.useMessage();

	const openPaperModal = () => {
		setPaperModal(true);
	};

	return (
		<>
			{contextHolder}
			<div className="home-container">
				<div className="home-title-container">
					<span className="home-title">
						<Link to={"/profile"} className="home-profile-link">
							<div className="home-profile-img-wrapper">
								<img
									className="home-profile-img"
									src={`${profileImg}`}
									alt="profileImage"
								/>
							</div>
							{userName}
						</Link>
						님의 페이퍼 목록
					</span>
				</div>
				<div className="home-paper-container">
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
