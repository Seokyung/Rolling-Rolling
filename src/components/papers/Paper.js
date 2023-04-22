import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService, dbService, storageService } from "api/fbase";
import { onAuthStateChanged } from "firebase/auth";
import {
	doc,
	deleteDoc,
	query,
	collection,
	getDocs,
	onSnapshot,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useSelector } from "react-redux";

import PrivatePaper from "./PrivatiePaper";
import CreateMessage from "components/messgaes/CreateMessage";
import MessageList from "components/messgaes/MessageList";
import EditPaper from "./EditPaper";
import PaperSettings from "./PaperSettings";

import { Modal } from "react-bootstrap";
import { Skeleton, message } from "antd";
import {
	faAngleLeft,
	faEllipsis,
	faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
	const [deleteModal, setDeleteModal] = useState(false);
	const [msgModal, setMsgModal] = useState(false);
	const [shareModal, setShareModal] = useState(false);

	const [messageApi, contextHolder] = message.useMessage();
	const key = "updatable";

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

	const openDeleteModal = () => {
		setPaperSettings(false);
		setDeleteModal(true);
	};

	const closeDeleteModal = () => {
		setDeleteModal(false);
	};

	const deletePaper = async () => {
		messageApi.open({
			key,
			type: "loading",
			content: "페이지 삭제중...",
		});

		try {
			const msgQuery = query(
				collection(dbService, "papers", `${paperId}`, "messages")
			);
			const msgSnapshot = await getDocs(msgQuery);
			msgSnapshot.forEach(async (msg) => {
				const msgRef = doc(
					dbService,
					"papers",
					`${paperId}`,
					"messages",
					`${msg.id}`
				);
				if (msg.data().msgImg !== "") {
					const urlRef = ref(storageService, msg.data().msgImg);
					await deleteObject(urlRef);
				}
				await deleteDoc(msgRef);
			});
			const paperRef = doc(dbService, "papers", `${paperId}`);
			await deleteDoc(paperRef);
			messageApi.open({
				key,
				type: "success",
				content: "페이퍼가 삭제되었습니다!",
				duration: 2,
			});
		} catch (error) {
			messageApi.open({
				key,
				type: "error",
				content: "페이퍼 삭제에 실패하였습니다 😢",
				duration: 2,
			});
			console.log(error.code);
		} finally {
			setDeleteModal(false);
			navigate("/", { replace: true });
		}
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
							{contextHolder}
							<div className="paper-wrapper">
								<div className="paper-container">
									<div className="paper-header-container">
										<button className="paper-prev-btn" onClick={gotoPrevPage}>
											<FontAwesomeIcon icon={faAngleLeft} />
										</button>
										<div className="paper-title-container">
											<h2 className="paper-title">{paperObj.paperName}</h2>
										</div>
										{userId === paperObj.paperCreator && (
											<button
												className="paper-setting-btn"
												onClick={showPaperSettings}
											>
												<FontAwesomeIcon icon={faEllipsis} />
											</button>
										)}
									</div>
									<MessageList paperCreator={paperObj.paperCreator} />
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
								openDeleteModal={openDeleteModal}
							/>
							{userId === paperObj.paperCreator && editModal && (
								<EditPaper
									paperObj={paperObj}
									isOwner={userId === paperObj.paperCreator}
									editModal={editModal}
									setEditModal={setEditModal}
								/>
							)}
							<Modal
								show={deleteModal}
								onExit={closeDeleteModal}
								centered
								animation={true}
								keyboard={false}
								backdrop="static"
							>
								Delete?
								<button onClick={deletePaper}>delete</button>
								<button onClick={closeDeleteModal}>close</button>
							</Modal>
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
