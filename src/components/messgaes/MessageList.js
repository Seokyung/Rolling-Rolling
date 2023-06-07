import React, { useEffect, useState } from "react";
import { authService, dbService } from "api/fbase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Message from "components/messgaes/Message";
import { useSelector } from "react-redux";

import { Row, Col } from "react-bootstrap";
import { Skeleton, Empty, message } from "antd";
import "./MessageList.css";

function MessageList() {
	const userId = useSelector((state) => state.userReducer.uid);
	const paperCreatorId = useSelector((state) => state.paperReducer.creatorId);
	const paperId = useSelector((state) => state.paperReducer.paperId);

	const [init, setInit] = useState(true);
	const [isMessages, setIsMessages] = useState(false);
	const [messages, setMessages] = useState([]);

	const [messageApi, contextHolder] = message.useMessage();

	useEffect(() => {
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
				<>
					{contextHolder}
					<div className="messageList-container">
						{isMessages ? (
							<Row xs={1} sm={1} md={1} lg={2} xl={3} className="g-4">
								{messages.map(
									(message) => (
										// 페이퍼 주인, 메세지 작성자가 아니면 비밀 메세지 내용만 가리는 코드
										<Col key={message.id}>
											<Message
												msgObj={message}
												isOwner={
													paperCreatorId === userId ||
													userId === message.creatorId
												}
												messageApi={messageApi}
											/>
										</Col>
									)
									// 페이퍼 주인, 메세지 작성자가 아니면 비밀 메세지가 아예 안보이게 하는 코드
									// message.isPrivate ? (
									// 	(paperCreatorId === userId ||
									// 		userId === message.creatorId) && (
									// 		<Col key={message.id}>
									// 			<Message
									// 				msgObj={message}
									// 				isOwner={
									// 					paperCreatorId === userId ||
									// 					userId === message.creatorId
									// 				}
									// 			/>
									// 		</Col>
									// 	)
									// ) : (
									// 	<Col key={message.id}>
									// 		<Message
									// 			msgObj={message}
									// 			isOwner={
									// 				paperCreatorId === userId ||
									// 				userId === message.creatorId
									// 			}
									// 		/>
									// 	</Col>
									// )
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
				</>
			)}
		</>
	);
}

export default MessageList;
