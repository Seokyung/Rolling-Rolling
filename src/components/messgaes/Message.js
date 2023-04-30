import React from "react";
import { dbService, storageService } from "api/fbase";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import { Card, Button } from "react-bootstrap";
import "./Message.css";

function Message({ msgObj, isOwner }) {
	const deleteMessage = async (msgObj) => {
		const isDelete = window.confirm(
			`${msgObj.msgTitle} 메세지를 삭제하시겠습니까?`
		);
		if (isDelete) {
			const msgRef = doc(
				dbService,
				"papers",
				`${msgObj.paperId}`,
				"messages",
				`${msgObj.id}`
			);
			await deleteDoc(msgRef);
			if (msgObj.msgImg !== "") {
				const urlRef = ref(storageService, msgObj.msgImg);
				await deleteObject(urlRef);
			}
			alert("메세지가 삭제되었습니다!");
		}
	};

	return (
		<Card className="message-card-container">
			<Card.Body>
				<Card.Title className="message-card-title">
					{msgObj.isPrivate && <span className="private-icon">🔒</span>}
					{msgObj.msgTitle}
				</Card.Title>
				<Card.Subtitle className="message-card-writer">
					작성자: {msgObj.msgWriter}
				</Card.Subtitle>
				<Card.Text className="message-card-content">
					{msgObj.msgContent}
				</Card.Text>
				{msgObj.msgImg && (
					<Card.Link
						href={msgObj.msgImg}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Card.Img
							src={msgObj.msgImg}
							className="message-card-img"
							alt="messageImage"
						/>
					</Card.Link>
				)}
				{isOwner && (
					<div className="message-delete-btn">
						<Button onClick={() => deleteMessage(msgObj)}>메세지 삭제</Button>
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

export default Message;
