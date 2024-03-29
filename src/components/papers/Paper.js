import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService, dbService } from "api/fbase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { getPaper } from "modules/paper";

import MessageList from "components/messgaes/MessageList";
import PaperSettings from "./PaperSettings";
import DeletePaper from "./DeletePaper";
import SharePaper from "./SharePaper";

import { Stack, Button } from "react-bootstrap";
import { Skeleton } from "antd";
import {
	faAngleLeft,
	faEllipsisVertical,
	faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Paper.css";

function Paper() {
	const dispatch = useDispatch();
	const userId = useSelector((state) => state.userReducer.uid);
	const { paperId } = useParams();

	const navigate = useNavigate();

	const [init, setInit] = useState(true);
	const [paperObj, setPaperObj] = useState({});
	const [paperSettings, setPaperSettings] = useState(false);

	const [deleteModal, setDeleteModal] = useState(false);

	const getPaperDispatch = (paperDocObj) => {
		dispatch(
			getPaper({
				paperId: paperDocObj.paperId,
				paperName: paperDocObj.paperName,
				createdAt: paperDocObj.createdAt,
				creatorId: paperDocObj.creatorId,
				isPrivate: paperDocObj.isPrivate,
			})
		);
	};

	useEffect(() => {
		const unsubscribe = onSnapshot(
			doc(dbService, "papers", `${paperId}`),
			(doc) => {
				const paperDocObj = {
					paperId: paperId,
					paperName: doc.data().paperName,
					createdAt: doc.data().createdAt,
					creatorId: doc.data().creatorId,
					isPrivate: doc.data().isPrivate,
					paperCode: doc.data().paperCode,
				};
				getPaperDispatch(paperDocObj);
				setPaperObj(paperDocObj);
				setInit(false);
			}
		);
		onAuthStateChanged(authService, (user) => {
			if (user === null) {
				unsubscribe();
			}
		});
	}, []);

	const showPaperSettings = () => {
		setPaperSettings((prev) => !prev);
	};

	const gotoEditPaper = () => {
		navigate(`/paper/${paperId}/create-message`);
	};

	const gotoPrevPage = () => {
		navigate("/");
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<>
			{init ? (
				<Skeleton active />
			) : (
				<>
					<>
						<div className="paper-wrapper">
							<div className="paper-container">
								<Stack
									direction="horizontal"
									className="paper-header-container"
									gap={2}
								>
									<div className="paper-header-btn paper-header-margin-top">
										<button onClick={gotoPrevPage}>
											<FontAwesomeIcon icon={faAngleLeft} />
										</button>
									</div>
									<div className="paper-title-container">
										<h5 className="paper-title">{paperObj.paperName}</h5>
									</div>
									<div className="paper-header-btn paper-header-margin-top">
										{userId === paperObj.creatorId && (
											<button onClick={showPaperSettings}>
												<FontAwesomeIcon icon={faEllipsisVertical} />
											</button>
										)}
									</div>
								</Stack>
								<MessageList />
								{userId === paperObj.creatorId && <SharePaper />}
							</div>
							<Button className="paper-creating-btn" onClick={gotoEditPaper}>
								<FontAwesomeIcon
									className="paper-creating-btn-icon"
									icon={faEnvelope}
								/>
								메세지 쓰기
							</Button>
						</div>
						<PaperSettings
							paperSettings={paperSettings}
							setPaperSettings={setPaperSettings}
							setDeleteModal={setDeleteModal}
						/>
						<DeletePaper
							deleteModal={deleteModal}
							setDeleteModal={setDeleteModal}
							paperId={paperId}
						/>
					</>
					<Button
						variant="light"
						className="scroll-top-btn"
						onClick={scrollToTop}
					>
						<FontAwesomeIcon icon={faChevronUp} />
					</Button>
				</>
			)}
		</>
	);
}

export default Paper;
