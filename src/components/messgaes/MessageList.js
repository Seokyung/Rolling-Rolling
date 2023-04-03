import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authService, dbService } from "api/fbase";
import { onAuthStateChanged } from "firebase/auth";
import {
	collection,
	query,
	where,
	orderBy,
	onSnapshot,
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

	return (
		<div>
			{messages.map((message) => (
				<div key={message.id}>
					<Message msgObj={message} isOwner={paperCreator === userObj.uid} />
				</div>
			))}
		</div>
	);
}

export default MessageList;
