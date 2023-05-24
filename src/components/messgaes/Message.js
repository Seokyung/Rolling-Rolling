import React, { useState } from "react";
import DeleteMessage from "./DeleteMessage";

import { Card, Button } from "react-bootstrap";
import { Image } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./Message.css";

function Message({ msgObj, isOwner, messageApi }) {
	const [deleteModal, setDeleteModal] = useState(false);
	const [deleteMsgObj, setDeleteMsgObj] = useState("");

	const openDeleteModal = (msgObj) => {
		setDeleteModal(true);
		setDeleteMsgObj(msgObj);
	};

	// 페이퍼 주인, 메세지 작성자가 아니면 비밀 메세지 내용만 가리는 코드
	return (
		<>
			<Card className="message-card-container">
				{msgObj.isPrivate ? (
					isOwner ? (
						<Card.Body>
							<Card.Title className="message-card-title">
								{msgObj.isPrivate && <span className="private-icon">🔒</span>}
								{msgObj.msgTitle}
							</Card.Title>
							<Card.Subtitle className="mb-3 text-muted message-card-subs">
								{msgObj.createdAt}
							</Card.Subtitle>
							<Card.Subtitle className="mb-3 text-muted message-card-subs">
								<span className="private-icon">👤</span>
								{msgObj.msgWriter}
							</Card.Subtitle>
							<Card.Text className="message-card-content">
								{msgObj.msgContent}
							</Card.Text>
							{msgObj.msgImg && (
								<Image
									src={msgObj.msgImg}
									className="message-card-img"
									alt="messageImage"
								/>
								// <Card.Link
								// 	href={msgObj.msgImg}
								// 	target="_blank"
								// 	rel="noopener noreferrer"
								// >
								// 	<Card.Img
								// 		src={msgObj.msgImg}
								// 		className="message-card-img"
								// 		alt="messageImage"
								// 	/>
								// </Card.Link>
							)}
							{isOwner && (
								<div className="message-delete-btn">
									<Button
										variant="outline-danger"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											openDeleteModal(msgObj);
										}}
									>
										<FontAwesomeIcon icon={faTrash} />
									</Button>
								</div>
							)}
						</Card.Body>
					) : (
						<Card.Body>
							<Card.Title className="message-card-title">
								{msgObj.isPrivate && <span className="private-icon">🔒</span>}
								비밀 메세지입니다 🤫
							</Card.Title>
							<Card.Subtitle className="mb-3 text-muted message-card-subs">
								{msgObj.createdAt}
							</Card.Subtitle>
							<Card.Subtitle className="mb-3 text-muted message-card-subs">
								<span className="private-icon">👤</span>
								{msgObj.msgWriter}
							</Card.Subtitle>
						</Card.Body>
					)
				) : (
					<Card.Body>
						<Card.Title className="message-card-title">
							{msgObj.msgTitle}
						</Card.Title>
						<Card.Subtitle className="mb-3 text-muted message-card-subs">
							{msgObj.createdAt}
						</Card.Subtitle>
						<Card.Subtitle className="mb-3 text-muted message-card-subs">
							<span className="private-icon">👤</span>
							{msgObj.msgWriter}
						</Card.Subtitle>
						<Card.Text className="message-card-content">
							{msgObj.msgContent}
						</Card.Text>
						{msgObj.msgImg && (
							<Image
								src={msgObj.msgImg}
								className="message-card-img"
								alt="messageImage"
							/>
						)}
						{isOwner && (
							<div className="message-delete-btn">
								<Button
									variant="outline-danger"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										openDeleteModal(msgObj);
									}}
								>
									<FontAwesomeIcon icon={faTrash} />
								</Button>
							</div>
						)}
					</Card.Body>
				)}
			</Card>
			<DeleteMessage
				deleteModal={deleteModal}
				setDeleteModal={setDeleteModal}
				msgObj={deleteMsgObj}
				messageApi={messageApi}
			/>
		</>
	);

	// 페이퍼 주인, 메세지 작성자가 아니면 비밀 메세지가 아예 안보이게 하는 코드
	// return (
	// 	<Card className="message-card-container">
	// 		<Card.Body>
	// 			<Card.Title className="message-card-title">
	// 				{msgObj.isPrivate && <span className="private-icon">🔒</span>}
	// 				{msgObj.msgTitle}
	// 			</Card.Title>
	// 			<Card.Subtitle className="mb-3 text-muted message-card-subs">
	// 				{msgObj.createdAt}
	// 			</Card.Subtitle>
	// 			<Card.Subtitle className="mb-3 text-muted message-card-subs">
	// 				<span className="private-icon">👤</span>
	// 				{msgObj.msgWriter}
	// 			</Card.Subtitle>
	// 			<Card.Text className="message-card-content">
	// 				{msgObj.msgContent}
	// 			</Card.Text>
	// 			{msgObj.msgImg && (
	// 				<Card.Link
	// 					href={msgObj.msgImg}
	// 					target="_blank"
	// 					rel="noopener noreferrer"
	// 				>
	// 					<Card.Img
	// 						src={msgObj.msgImg}
	// 						className="message-card-img"
	// 						alt="messageImage"
	// 					/>
	// 				</Card.Link>
	// 			)}
	// 			{isOwner && (
	// 				<div className="message-delete-btn">
	// 					<Button
	// 						variant="outline-danger"
	// 						onClick={() => deleteMessage(msgObj)}
	// 					>
	// 						<FontAwesomeIcon icon={faTrash} />
	// 					</Button>
	// 				</div>
	// 			)}
	// 		</Card.Body>
	// 	</Card>
	// );
}

export default Message;
