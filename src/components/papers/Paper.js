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
} from "firebase/firestore";
import CreateMessage from "components/messgaes/CreateMessage";

function Paper({ userObj }) {
	const { paperId } = useParams();
	const [paperName, setPaperName] = useState("");
	const [messages, setMessages] = useState([]);
	const [msgModal, setMsgModal] = useState(false);

	const getPaper = async () => {
		const paper = doc(dbService, "papers", `${paperId}`);
		const paperSnap = await getDoc(paper);
		if (paperSnap.exists()) {
			setPaperName(paperSnap.data().paperName);
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

	const showMsgModal = () => {
		setMsgModal((prev) => !prev);
	};

	return (
		<div>
			<h2>{paperName}</h2>
			<div>
				{messages.map((message) => (
					<div key={message.id}>
						<h3>{message.msgTitle}</h3>
						<h4>{message.msgWriter}</h4>
						<p>{message.msgContent}</p>
					</div>
				))}
			</div>
			<button onClick={showMsgModal}>메세지 작성하기</button>
			{msgModal && (
				<CreateMessage setMsgModal={setMsgModal} paperId={paperId} />
			)}
		</div>
	);
}

export default Paper;
