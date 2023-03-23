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
import Message from "components/messgaes/Message";

function MessageList({ userObj }) {
	const { paperId } = useParams();
	const [paperCreator, setPaperCreator] = useState("");
	const [messages, setMessages] = useState([]);

	const getPaperCreator = async () => {
		const paper = doc(dbService, "papers", `${paperId}`);
		const paperSnap = await getDoc(paper);
		if (paperSnap.exists()) {
			setPaperCreator(paperSnap.data().creatorId);
		} else {
			console.log("This document doesn't exist!");
		}
	};

	useEffect(() => {
		getPaperCreator();
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

	return (
		<div>
			{messages.map((message) => (
				<div key={message.id}>
					<Message msgObj={message} />
					{paperCreator === userObj.uid && (
						<button onClick={() => deleteMessage(message)}>메세지 삭제</button>
					)}
				</div>
			))}
		</div>
	);
}

export default MessageList;
