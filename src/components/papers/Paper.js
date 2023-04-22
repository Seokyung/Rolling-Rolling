import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService, dbService, storageService } from "api/fbase";
import { onAuthStateChanged } from "firebase/auth";
import {
	doc,
	onSnapshot,
	deleteDoc,
	query,
	collection,
	getDocs,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import CreateMessage from "components/messgaes/CreateMessage";
import MessageList from "components/messgaes/MessageList";
import EditPaper from "./EditPaper";
import { useSelector } from "react-redux";

import { Skeleton } from "antd";
import { Offcanvas } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import "./Paper.css";
import PrivatePaper from "./PrivatiePaper";

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

	const deletePaper = async () => {
		const isDelete = window.confirm(
			`${paperObj.paperName} 페이퍼를 삭제하시겠습니까?`
		);
		if (isDelete) {
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
				alert("페이퍼가 삭제되었습니다!");
			} catch (error) {
				console.log(error.message);
			} finally {
				navigate("/", { replace: true });
			}
		}
	};

	const showPaperSettings = () => {
		setPaperSettings((prev) => !prev);
	};

	const openEditModal = () => {
		setPaperSettings(false);
		setEditModal(true);
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
							<Offcanvas
								show={paperSettings}
								onHide={showPaperSettings}
								placement="bottom"
							>
								<Offcanvas.Header closeButton>페이퍼 설정</Offcanvas.Header>
								<Offcanvas.Body>
									<button onClick={openEditModal}>페이퍼 수정</button>
									<button onClick={deletePaper}>페이퍼 삭제</button>
								</Offcanvas.Body>
							</Offcanvas>
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
