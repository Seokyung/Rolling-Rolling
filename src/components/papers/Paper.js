import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authService, dbService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";
import {
	doc,
	getDoc,
	collection,
	query,
	orderBy,
	onSnapshot,
	deleteDoc,
} from "firebase/firestore";
import CreateMessage from "components/messgaes/CreateMessage";
import Message from "components/messgaes/Message";

function Paper({ userObj }) {
	const { paperId } = useParams();
	const [paperObj, setPaperObj] = useState({});
	const [paperCode, setPaperCode] = useState("");
	const [isPrivate, setIsPrivate] = useState(true);
	const [messages, setMessages] = useState([]);
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
			setIsPrivate(paperSnap.data().isPrivate);
			setPaperObj(paperSnapObj);
		} else {
			console.log("This document doesn't exist!");
		}
	};

	useEffect(() => {
		getPaper();
		const q = query(
			collection(dbService, "papers", `${paperId}`, "messages"),
			orderBy("createdAt", "desc")
		);
		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const messageArray = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setMessages(messageArray);
			},
			(error) => {
				alert(`Paper: ${error.message}`);
				console.log(`Paper: ${error}`);
			}
		);
		onAuthStateChanged(authService, (user) => {
			if (user === null) {
				unsubscribe();
			}
		});
	}, []);

	const onPaperCodeChange = (e) => {
		const {
			target: { value, maxLength },
		} = e;
		if (value.length > maxLength) {
			value = value.slice(0, maxLength);
		}
		setPaperCode(value);
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

	const deleteMessage = async (message) => {
		const isDelete = window.confirm(
			`${message.msgTitle} 메세지를 삭제하시겠습니까?`
		);
		if (isDelete) {
			const msgRef = doc(
				dbService,
				"papers",
				`${message.paperId}`,
				"messages",
				`${message.id}`
			);
			await deleteDoc(msgRef);
		}
	};

	const showMsgModal = () => {
		setMsgModal((prev) => !prev);
	};

	return (
		<>
			{isPrivate ? (
				<div>
					<h2>페이지 비밀번호를 입력하세요!</h2>
					<form onSubmit={onSubmitPaperCode}>
						<input
							type="number"
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
					<div>
						{messages.map((message) => (
							<div key={message.id}>
								<Message msgObj={message} />
								{paperObj.paperCreator === userObj.uid && (
									<button onClick={() => deleteMessage(message)}>
										메세지 삭제
									</button>
								)}
							</div>
						))}
					</div>
					<button onClick={showMsgModal}>메세지 작성하기</button>
					{msgModal && (
						<CreateMessage paperId={paperId} setMsgModal={setMsgModal} />
					)}
				</div>
			)}
		</>
	);
}

export default Paper;
