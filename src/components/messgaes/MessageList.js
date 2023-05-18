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

import { Row, Col } from "react-bootstrap";
import { Skeleton, Empty } from "antd";
import "./MessageList.css";

function MessageList() {
	const userId = useSelector((state) => state.userReducer.uid);
	const paperCreatorId = useSelector((state) => state.paperReducer.creatorId);
	const paperId = useSelector((state) => state.paperReducer.paperId);

	const [init, setInit] = useState(true);
	const [isMessages, setIsMessages] = useState(false);
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		// let q;
		// if (paperCreatorId === userId) {
		// 	q = query(
		// 		collection(dbService, "papers", `${paperId}`, "messages"),
		// 		orderBy("createdAt", "desc")
		// 	);
		// } else {
		// 	q = query(
		// 		collection(dbService, "papers", `${paperId}`, "messages"),
		// 		where("isPrivate", "==", false),
		// 		orderBy("createdAt", "desc")
		// 	);
		// }

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
				if (messageArray.length !== 0) {
					setIsMessages(true);
				} else {
					setIsMessages(false);
				}
				setMessages(messageArray);
				setInit(false);
			},
			(error) => {
				console.log(error.code);
			}
		);
		onAuthStateChanged(authService, (user) => {
			if (user === null) {
				unsubscribe();
			}
		});
	}, []);

	return (
		<>
			{init ? (
				<Skeleton active />
			) : (
				<div className="messageList-container">
					{isMessages ? (
						<Row xs={2} sm={2} md={2} lg={3} xl={3} className="g-4">
							{messages.map((message) =>
								message.isPrivate ? (
									(paperCreatorId === userId ||
										userId === message.creatorId) && (
										<Col key={message.id}>
											<Message
												msgObj={message}
												isOwner={
													paperCreatorId === userId ||
													userId === message.creatorId
												}
											/>
										</Col>
									)
								) : (
									<Col key={message.id}>
										<Message
											msgObj={message}
											isOwner={
												paperCreatorId === userId ||
												userId === message.creatorId
											}
										/>
									</Col>
								)
							)}
						</Row>
					) : (
						<Empty
							description={
								<div className="empty-container">
									<span className="empty-text">
										아직 게시된 메세지가 없네요!
									</span>
									<span className="empty-text">메세지를 작성해보세요 😉</span>
								</div>
							}
						/>
					)}
				</div>
			)}
		</>
	);
}

export default MessageList;
