import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dbService } from "fbase";
import { doc, getDoc } from "firebase/firestore";
import CreateMessage from "components/messgaes/CreateMessage";
import MessageList from "components/messgaes/MessageList";

function Paper({ userObj }) {
	const { paperId } = useParams();
	const [init, setInit] = useState(true);
	const [paperObj, setPaperObj] = useState({});
	const [paperCode, setPaperCode] = useState("");
	const [isPrivate, setIsPrivate] = useState(true);
	const [msgModal, setMsgModal] = useState(false);

	const getPaper = async () => {
		const paper = doc(dbService, "papers", `${paperId}`);
		const paperSnap = await getDoc(paper);
		if (paperSnap.exists()) {
			const paperSnapObj = {
				paperName: paperSnap.data().paperName,
				paperCreator: paperSnap.data().creatorId,
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
							<button onClick={showMsgModal}>메세지 작성하기</button>
							{msgModal && (
								<CreateMessage paperId={paperId} setMsgModal={setMsgModal} />
							)}
							<MessageList
								userObj={userObj}
								paperCreator={paperObj.paperCreator}
							/>
						</div>
					)}
				</>
			)}
		</>
	);
}

export default Paper;
