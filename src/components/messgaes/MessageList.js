import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authService, dbService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";
import {
	doc,
	getDoc,
	collection,
	query,
	where,
	orderBy,
	onSnapshot,
	deleteDoc,
} from "firebase/firestore";
import Message from "components/messgaes/Message";

function MessageList({ userObj, paperCreator }) {
	const { paperId } = useParams();
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		let q;
		if (paperCreator === userObj.uid) {
			q = query(
				collection(dbService, "papers", `${paperId}`, "messages"),
				orderBy("createdAt", "desc")
			);
		} else {
			q = query(
				collection(dbService, "papers", `${paperId}`, "messages"),
				where("isPrivate", "==", false),
				orderBy("createdAt", "desc")
			);
		}
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
	}, [paperCreator]);

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
