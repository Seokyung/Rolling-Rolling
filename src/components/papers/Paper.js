import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dbService } from "fbase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import CreateMessage from "components/messgaes/CreateMessage";
import MessageList from "components/messgaes/MessageList";
import EditPaper from "./EditPaper";

function Paper({ userObj }) {
	const { paperId } = useParams();
	const navigate = useNavigate();
	const [init, setInit] = useState(true);
	const [paperObj, setPaperObj] = useState({});
	const [paperCode, setPaperCode] = useState("");
	const [isPrivate, setIsPrivate] = useState(true);
	const [editModal, setEditModal] = useState(false);
	const [msgModal, setMsgModal] = useState(false);

	const getPaper = async () => {
		const paper = doc(dbService, "papers", `${paperId}`);
		const paperSnap = await getDoc(paper);
		if (paperSnap.exists()) {
			const paperSnapObj = {
				paperId: paperSnap.data().paperId,
				paperName: paperSnap.data().paperName,
				paperCreator: paperSnap.data().creatorId,
				isPrivate: paperSnap.data().isPrivate,
				paperCode: paperSnap.data().paperCode,
			};
			setInit(false);
			setIsPrivate(paperSnap.data().isPrivate);
			setPaperObj(paperSnapObj);
		} else {
			console.log("This document doesn't exist!");
		}
	};

	useEffect(() => {
		getPaper();
	}, []);

	const onPaperCodeChange = (e) => {
		const {
			target: { value, maxLength },
		} = e;
		if (value.length > maxLength) {
			value = value.slice(0, maxLength);
		}
		if (!isNaN(value)) {
			setPaperCode(value);
		}
	};

	const onSubmitPaperCode = (e) => {
		e.preventDefault();
		if (paperObj.paperCode === paperCode) {
			setIsPrivate(false);
			setPaperCode("");
		} else {
			alert("페이지 비밀번호가 다릅니다!");
			setPaperCode("");
		}
	};

	const deletePaper = async (paperName) => {
		const isDelete = window.confirm(`${paperName} 페이퍼를 삭제하시겠습니까?`);
		if (isDelete) {
			const paperRef = doc(dbService, "papers", `${paperId}`);
			await deleteDoc(paperRef);
		}
		navigate("/", { replace: true });
	};

	const showEditModal = () => {
		setEditModal((prev) => !prev);
	};

	const showMsgModal = () => {
		setMsgModal((prev) => !prev);
	};

	return (
		<>
			{init ? (
				<h2>Intializing...</h2>
			) : (
				<>
					{isPrivate ? (
						<div>
							<h2>페이지 비밀번호를 입력하세요!</h2>
							<form onSubmit={onSubmitPaperCode}>
								<input
									type="password"
									autoFocus
									value={paperCode}
									onChange={onPaperCodeChange}
									maxLength="4"
									placeholder="페이지 비밀번호"
								/>
								<input type="submit" value="제출" />
							</form>
						</div>
					) : (
						<div>
							<h2>{paperObj.paperName}</h2>
							{userObj.uid === paperObj.paperCreator && (
								<>
									<button onClick={showEditModal}>페이퍼 수정</button>
									<button onClick={() => deletePaper(paperObj.paperName)}>
										페이퍼 삭제
									</button>
									{editModal && (
										<EditPaper
											paperObj={paperObj}
											isOwner={userObj.uid === paperObj.paperCreator}
											setEditModal={setEditModal}
										/>
									)}
								</>
							)}
							<MessageList
								userObj={userObj}
								paperCreator={paperObj.paperCreator}
							/>
							<button onClick={showMsgModal}>메세지 작성하기</button>
							{msgModal && (
								<CreateMessage paperId={paperId} setMsgModal={setMsgModal} />
							)}
						</div>
					)}
				</>
			)}
		</>
	);
}

export default Paper;
