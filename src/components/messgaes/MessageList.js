import React, { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";

import { Row, Col, Card } from "react-bootstrap";
import "./MessageList.css";

function MessageList() {
	const userId = useSelector((state) => state.userReducer.uid);
	const creatorId = useSelector((state) => state.paperReducer.creatorId);
	const paperId = useSelector((state) => state.paperReducer.paperId);
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		let q;
		if (creatorId === userId) {
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
	}, []);

	return (
		<div className="messageList-container">
			<Row md={3} className="g-2">
				{messages.map((message) => (
					<Col key={message.id}>
						<Card>
							<Message msgObj={message} isOwner={creatorId === userId} />
						</Card>
					</Col>
				))}
			</Row>
		</div>
	);
}

export default MessageList;
