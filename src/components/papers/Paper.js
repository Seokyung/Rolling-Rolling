import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService, dbService } from "api/fbase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useSelector } from "react-redux";

import PrivatePaper from "./PrivatiePaper";
import CreateMessage from "components/messgaes/CreateMessage";
import MessageList from "components/messgaes/MessageList";
import EditPaper from "./EditPaper";
import PaperSettings from "./PaperSettings";

import { Skeleton } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import "./Paper.css";

function Paper() {
	const userId = useSelector((state) => state.userReducer.uid);
	const { paperId } = useParams();
	const [init, setInit] = useState(true);
	const navigate = useNavigate();
	const paperUrlRef = useRef();

	const [paperObj, setPaperObj] = useState({});
	const [isPrivate, setIsPrivate] = useState(false);
	const [paperSettings, setPaperSettings] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [msgModal, setMsgModal] = useState(false);
	const [shareModal, setShareModal] = useState(false);

	useEffect(() => {
		const unsubscribe = onSnapshot(
			doc(dbService, "papers", `${paperId}`),
			(doc) => {
				const paperDocObj = {
					paperId: paperId,
					paperName: doc.data().paperName,
					paperCreator: doc.data().creatorId,
					isPrivate: doc.data().isPrivate,
					paperCode: doc.data().paperCode,
				};
				setIsPrivate(doc.data().isPrivate);
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

	const openMsgModal = () => {
		setMsgModal(true);
	};

	const onShareClick = () => {
		paperUrlRef.current.focus();
		paperUrlRef.current.select();
		navigator.clipboard.writeText(paperUrlRef.current.value).then(() => {
			alert("링크를 복사했습니다!");
		});
	};

	const showShareModal = () => {
		setShareModal((prev) => !prev);
	};

	const gotoPrevPage = () => {
		navigate(-1);
	};

	return (
		<>
			{init ? (
				<Skeleton active />
			) : (
				<>
					{isPrivate ? (
						<PrivatePaper
							isPrivate={isPrivate}
							setIsPrivate={setIsPrivate}
							paperCode={paperObj.paperCode}
						/>
					) : (
						<>
							<div className="paper-wrapper">
								<div className="paper-container">
									<div className="paper-header-container">
										<button className="paper-header-btn" onClick={gotoPrevPage}>
											<FontAwesomeIcon icon={faAngleLeft} />
										</button>
										<div className="paper-title-container">
											<h2 className="paper-title">{paperObj.paperName}</h2>
										</div>
										{userId === paperObj.paperCreator && (
											<button
												className="paper-header-btn"
												onClick={showPaperSettings}
											>
												<FontAwesomeIcon icon={faEllipsis} />
											</button>
										)}
									</div>
									<MessageList paperCreator={paperObj.paperCreator} />
									<button className="paper-share-btn" onClick={showShareModal}>
										공유하기
									</button>
									{shareModal && (
										<div>
											<input
												type="text"
												readOnly
												ref={paperUrlRef}
												value={`http://localhost:3000/paper/${paperId}`}
											/>
											<button onClick={onShareClick}>링크 복사</button>
										</div>
									)}
								</div>
								<button
									className="paper-create-message-btn"
									onClick={openMsgModal}
								>
									메세지 작성하기
								</button>
							</div>
							<PaperSettings
								paperSettings={paperSettings}
								setPaperSettings={setPaperSettings}
								setEditModal={setEditModal}
								paperId={paperObj.paperId}
							/>
							{userId === paperObj.paperCreator && editModal && (
								<EditPaper
									paperObj={paperObj}
									isOwner={userId === paperObj.paperCreator}
									editModal={editModal}
									setEditModal={setEditModal}
								/>
							)}
							<CreateMessage
								paperId={paperId}
								msgModal={msgModal}
								setMsgModal={setMsgModal}
							/>
						</>
					)}
				</>
			)}
		</>
	);
}

export default Paper;
