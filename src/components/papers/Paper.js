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
import { Form, Button } from "react-bootstrap";
import "./Paper.css";

function Paper() {
	const userId = useSelector((state) => state.userReducer.uid);
	const { paperId } = useParams();
	const [init, setInit] = useState(true);
	const navigate = useNavigate();
	const codeInputRef = useRef([]);
	const paperUrlRef = useRef();
	const [paperObj, setPaperObj] = useState({});
	const [paperCode, setPaperCode] = useState(Array(4).fill(""));
	const [isPrivate, setIsPrivate] = useState(false);
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

	const onCodeChange = (e, index) => {
		const {
			target: { value },
		} = e;
		if (!isNaN(value)) {
			const newCodes = [...paperCode];
			newCodes[index] = value;
			setPaperCode(newCodes);
			if (value && index < codeInputRef.current.length - 1) {
				codeInputRef.current[index + 1].focus();
				if (paperCode[index + 1]) {
					codeInputRef.current[index + 1].select();
				}
			}
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace") {
			if (!paperCode[index] && index > 0) {
				codeInputRef.current[index - 1].focus();
			}
			const newCodes = [...paperCode];
			newCodes[index] = "";
			setPaperCode(newCodes);
		}
	};

	const renderCodeInputs = () => {
		return paperCode.map((code, index) => {
			return (
				<Form.Control
					className="paper-form-code"
					key={index}
					type="text"
					maxLength={1}
					value={code}
					ref={(el) => (codeInputRef.current[index] = el)}
					onChange={(e) => onCodeChange(e, index)}
					onKeyDown={(e) => handleKeyDown(e, index)}
				/>
			);
		});
	};

	useEffect(() => {
		if (isPrivate && codeInputRef.current[0]) {
			codeInputRef.current[0].focus();
			if (paperCode[0]) {
				codeInputRef.current[0].select();
			}
		}
	}, [isPrivate]);

	const onSubmitPaperCode = (e) => {
		e.preventDefault();
		if (paperObj.paperCode === paperCode.join("")) {
			setIsPrivate(false);
			setPaperCode(Array(4).fill(""));
		} else {
			alert("페이지 비밀번호가 다릅니다!");
			setPaperCode(Array(4).fill(""));
			codeInputRef.current[0].focus();
		}
	};

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

	const showEditModal = () => {
		setEditModal((prev) => !prev);
	};

	const showMsgModal = () => {
		setMsgModal((prev) => !prev);
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
						<Form>
							<Form.Group className="paper-form-code-container">
								<Form.Label className="paper-form-code-title">
									페이지 비밀번호를 입력하세요!
								</Form.Label>
								<div className="paper-form-code-group">
									{renderCodeInputs()}
								</div>
								<Button
									className="paper-form-code-btn"
									onClick={onSubmitPaperCode}
								>
									제출
								</Button>
							</Form.Group>
						</Form>
					) : (
						<div>
							<h2>{paperObj.paperName}</h2>
							{userId === paperObj.paperCreator && (
								<>
									<button onClick={showEditModal}>페이퍼 수정</button>
									<button onClick={deletePaper}>페이퍼 삭제</button>
									{editModal && (
										<EditPaper
											paperObj={paperObj}
											isOwner={userId === paperObj.paperCreator}
											setEditModal={setEditModal}
										/>
									)}
								</>
							)}
							<MessageList paperCreator={paperObj.paperCreator} />
							<button onClick={showMsgModal}>메세지 작성하기</button>
							{msgModal && (
								<CreateMessage paperId={paperId} setMsgModal={setMsgModal} />
							)}
							<button onClick={showShareModal}>공유하기</button>
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
							<button onClick={gotoPrevPage}>뒤로가기</button>
						</div>
					)}
				</>
			)}
		</>
	);
}

export default Paper;
