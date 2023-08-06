import React, { useEffect, useState } from "react";
import { authService, dbService } from "api/fbase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Message from "components/messgaes/Message";
import { useSelector } from "react-redux";
import useDebounce from "modules/useDebounce";

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

	const [msgRowNum, setMsgRowNum] = useState([]);
	const [msgColNum, setMsgColNum] = useState(
		parseInt(
			getComputedStyle(document.documentElement).getPropertyValue(
				"--msg-col-num"
			)
		)
	);

	const debouncedMsgColNum = useDebounce(msgColNum, 500);

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

		if (window.innerWidth > 1200) {
			setMsgColNum(4);
		} else if (window.innerWidth > 992) {
			setMsgColNum(3);
		} else if (window.innerWidth > 768) {
			setMsgColNum(2);
		} else {
			setMsgColNum(1);
		}

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleResize = () => {
		if (window.innerWidth > 1200) {
			setMsgColNum(4);
		} else if (window.innerWidth > 992) {
			setMsgColNum(3);
		} else if (window.innerWidth > 768) {
			setMsgColNum(2);
		} else {
			setMsgColNum(1);
		}
	};

	useEffect(() => {
		let newRowNum = [];
		if (parseInt(messages.length % msgColNum) === 0) {
			for (let i = 0; i < parseInt(messages.length / msgColNum); i++) {
				newRowNum.push(i);
			}
		} else {
			for (let i = 0; i < parseInt(messages.length / msgColNum) + 1; i++) {
				newRowNum.push(i);
			}
		}
		setMsgRowNum(newRowNum);
	}, [messages, debouncedMsgColNum]);

	const renderMsgRows = () => {
		return msgRowNum.map((rowIdx) => {
			return (
				<Row key={rowIdx} className="messageList-row">
					{messages
						.slice(rowIdx * msgColNum, (rowIdx + 1) * msgColNum)
						.map((message) => (
							// 페이퍼 주인, 메세지 작성자가 아니면 비밀 메세지 내용만 가리는 코드
							<Col key={message.id}>
								<Message
									msgObj={message}
									isOwner={
										paperCreatorId === userId || userId === message.creatorId
									}
									messageApi={messageApi}
								/>
							</Col>
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
						))}
				</Row>
			);
		});
	};

	return (
		<>
			{init ? (
				<Skeleton active />
			) : (
				<>
					{contextHolder}
					<div className="messageList-container">
						{isMessages ? (
							renderMsgRows()
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
