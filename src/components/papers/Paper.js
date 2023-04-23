import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService, dbService } from "api/fbase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { getPaper } from "modules/paper";

import PrivatePaper from "./PrivatiePaper";
import CreateMessage from "components/messgaes/CreateMessage";
import MessageList from "components/messgaes/MessageList";
import EditPaper from "./EditPaper";
import PaperSettings from "./PaperSettings";

import { Skeleton } from "antd";
import {
	faAngleLeft,
	faEllipsis,
	faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Paper.css";
import DeletePaper from "./DeletePaper";

function Paper() {
	const dispatch = useDispatch();
	const userId = useSelector((state) => state.userReducer.uid);
	const { paperId } = useParams();

	const navigate = useNavigate();
	const paperUrlRef = useRef();

	const [init, setInit] = useState(true);
	const [paperObj, setPaperObj] = useState({});
	const [isPrivate, setIsPrivate] = useState(false);
	const [paperSettings, setPaperSettings] = useState(false);

	const [editModal, setEditModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [msgModal, setMsgModal] = useState(false);
	const [shareModal, setShareModal] = useState(false);

	const getPaperDispatch = (paperDocObj) => {
		dispatch(
			getPaper({
				paperId: paperDocObj.paperId,
				paperName: paperDocObj.paperName,
				createdAt: paperDocObj.createdAt,
				creatorId: paperDocObj.creatorId,
				isPrivate: paperDocObj.isPrivate,
				// paperCode: paperDocObj.paperCode,
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
										<button className="paper-prev-btn" onClick={gotoPrevPage}>
											<FontAwesomeIcon icon={faAngleLeft} />
										</button>
										<div className="paper-title-container">
											<h2 className="paper-title">{paperObj.paperName}</h2>
											<h2>{paperObj.createdAt}</h2>
										</div>
										{userId === paperObj.creatorId && (
											<button
												className="paper-setting-btn"
												onClick={showPaperSettings}
											>
												<FontAwesomeIcon icon={faEllipsis} />
											</button>
										)}
									</div>
									<MessageList />
									<button className="paper-share-btn" onClick={showShareModal}>
										<FontAwesomeIcon icon={faShareNodes} />
										페이퍼 링크 공유하기
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
									<FontAwesomeIcon
										className="paper-create-message-btn-icon"
										icon={faEnvelope}
									/>
									메세지 작성하기
								</button>
							</div>
							<PaperSettings
								paperSettings={paperSettings}
								setPaperSettings={setPaperSettings}
								setEditModal={setEditModal}
								setDeleteModal={setDeleteModal}
							/>
							<EditPaper
								paperCode={paperObj.paperCode}
								editModal={editModal}
								setEditModal={setEditModal}
							/>
							<DeletePaper
								deleteModal={deleteModal}
								setDeleteModal={setDeleteModal}
							/>
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
