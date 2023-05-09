import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dbService, storageService } from "api/fbase";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import MessageImage from "./MessageImage";
import MessageCanvas from "./MessageCanvas";
import { useSelector } from "react-redux";

import { Form, Button } from "react-bootstrap";
import { Divider } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import "./CreateMessage.css";

function CreateMessage() {
	const userId = useSelector((state) => state.userReducer.uid);
	const { paperId } = useParams();
	const navigate = useNavigate();

	const [msgTitle, setMsgTitle] = useState("");
	const [msgWriter, setMsgWriter] = useState(
		useSelector((state) => state.userReducer.displayName)
	);
	const [msgContent, setMsgContent] = useState("");
	const [isAttachment, setIsAttachment] = useState(false);
	const [attachment, setAttachment] = useState("");
	const [msgImg, setMsgImg] = useState("");
	const [msgDrawing, setMsgDrawing] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);

	const [canvasModal, setCanvasModal] = useState(false);

	const [validated, setValidated] = useState(false);

	const closeCreateMessage = () => {
		navigate(`/paper/${paperId}`, { replace: true });
	};

	const onMessageChange = (e) => {
		const {
			target: { name, value },
		} = e;
		if (name === "title") {
			setMsgTitle(value);
		} else if (name === "writer") {
			setMsgWriter(value);
		} else if (name === "content") {
			setMsgContent(value);
		}
	};

	const onPrivateCheckChange = (e) => {
		const {
			target: { checked },
		} = e;
		setIsPrivate(checked);
	};

	const onAttachmentChange = (e) => {
		const {
			target: { checked },
		} = e;
		setIsAttachment(checked);
		if (!checked) {
			setAttachment("");
		}
	};

	const onAttachmentTypeChange = (e) => {
		const {
			target: { value },
		} = e;
		setAttachment(value);
	};

	const showCanvasModal = () => {
		setCanvasModal((prev) => !prev);
	};

	const clearMsgDrawing = () => {
		setMsgDrawing("");
	};

	const onMessageSubmit = async (e) => {
		e.preventDefault();

		if (msgTitle === "" || msgWriter === "") {
			setValidated(true);
			// alert("메세지 제목/작성자를 입력해주세요!");
			return;
		}

		let msgImgUrl = "";
		if (attachment === "attachImage" && msgImg !== "") {
			const msgImgRef = ref(storageService, `${userId}/${paperId}/${uuidv4()}`);
			await uploadString(msgImgRef, msgImg, "data_url");
			msgImgUrl = await getDownloadURL(msgImgRef);
		}
		if (attachment === "attachDrawing" && msgDrawing !== "") {
			const msgImgRef = ref(storageService, `${userId}/${paperId}/${uuidv4()}`);
			await uploadString(msgImgRef, msgDrawing, "data_url");
			msgImgUrl = await getDownloadURL(msgImgRef);
		}

		const currentTime = new Date();
		const year = currentTime.getFullYear();
		const month = String(currentTime.getMonth() + 1).padStart(2, "0");
		const date = String(currentTime.getDate()).padStart(2, "0");
		const formattedDate = `${year}/${month}/${date}`;

		const hours = String(currentTime.getHours()).padStart(2, "0");
		const minutes = String(currentTime.getMinutes()).padStart(2, "0");
		const seconds = String(currentTime.getSeconds()).padStart(2, "0");
		const formattedTime = `${hours}:${minutes}:${seconds}`;

		const formattedDateTime = `${formattedDate} ${formattedTime}`;

		const newMsg = doc(
			collection(dbService, "papers", `${paperId}`, "messages")
		);
		const msgObj = {
			paperId: paperId,
			creatorId: userId,
			msgTitle: msgTitle,
			msgWriter: msgWriter,
			msgContent: msgContent,
			msgImg: msgImgUrl,
			createdAt: formattedDateTime,
			isPrivate: isPrivate,
		};

		try {
			await setDoc(newMsg, msgObj);
			alert(`${msgTitle} 메세지가 작성되었습니다!`);
		} catch (error) {
			alert("메세지 작성에 실패하였습니다 :(");
			console.log(error);
		} finally {
			setMsgTitle("");
			setMsgWriter("");
			setMsgContent("");
			setMsgImg("");
			closeCreateMessage();
		}
	};

	return (
		<div className="paper-wrapper">
			<div className="paper-container">
				<div className="paper-header-container">
					<button className="paper-prev-btn" onClick={closeCreateMessage}>
						<FontAwesomeIcon icon={faAngleLeft} />
					</button>
					<div className="paper-title-container">
						<h2 className="editPaper-title">메세지 작성하기</h2>
					</div>
				</div>
				<div className="editPaper-form-container">
					<Form noValidate validated={validated}>
						<Form.Group className="create-form-group">
							<Form.Label className="create-form-title">메세지 제목</Form.Label>
							<Form.Control
								className="create-form-input"
								type="text"
								name="title"
								required
								autoFocus
								value={msgTitle}
								onChange={onMessageChange}
								placeholder="제목을 입력하세요 :)"
							/>
							<Form.Control.Feedback
								className="create-form-feedback"
								type="invalid"
							>
								메세지 제목을 입력해주세요!
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="create-form-group">
							<Form.Label className="create-form-title">작성자</Form.Label>
							<Form.Control
								className="create-form-input"
								type="text"
								name="writer"
								required
								value={msgWriter}
								onChange={onMessageChange}
								placeholder="이름을 입력하세요 :)"
							/>
							<Form.Control.Feedback
								className="create-form-feedback"
								type="invalid"
							>
								작성자를 입력해주세요!
							</Form.Control.Feedback>
						</Form.Group>
					</Form>
					<Form>
						<Form.Group className="create-form-group">
							<Form.Label className="create-form-title">메세지 내용</Form.Label>
							<Form.Control
								className="create-form-input"
								type="text"
								name="content"
								value={msgContent}
								onChange={onMessageChange}
								placeholder="내용을 입력하세요 :)"
							/>
						</Form.Group>
						<Form.Group className="create-form-group">
							<Form.Check type="checkbox" className="create-form-title">
								<Form.Check.Input
									type="checkbox"
									checked={isPrivate}
									onChange={onPrivateCheckChange}
								/>
								<Form.Label id="private-label">비공개</Form.Label>
							</Form.Check>
						</Form.Group>
					</Form>
					<Divider className="paper-divider" />
					<Form>
						<Form.Group className="create-form-group">
							<Form.Check type="checkbox" className="create-form-title">
								<Form.Check.Input
									type="checkbox"
									checked={isAttachment}
									onChange={onAttachmentChange}
								/>
								<Form.Label id="private-label">첨부파일</Form.Label>
							</Form.Check>
						</Form.Group>
						{isAttachment && (
							<>
								<div>
									<label>
										<input
											type="radio"
											name="attachmentType"
											id="attachImage"
											value="attachImage"
											checked={attachment === "attachImage"}
											onChange={onAttachmentTypeChange}
										/>
										이미지 첨부하기
									</label>
									<label>
										<input
											type="radio"
											name="attachmentType"
											id="attachDrawing"
											value="attachDrawing"
											checked={attachment === "attachDrawing"}
											onChange={onAttachmentTypeChange}
										/>
										그림 첨부하기
									</label>
								</div>
								{attachment === "attachImage" && (
									<MessageImage msgImg={msgImg} setMsgImg={setMsgImg} />
								)}
								{attachment === "attachDrawing" && (
									<div>
										<button onClick={showCanvasModal}>그림 그리기</button>
										{canvasModal && (
											<MessageCanvas
												setMsgDrawing={setMsgDrawing}
												setCanvasModal={setCanvasModal}
											/>
										)}
										{msgDrawing && (
											<div>
												<img
													src={msgDrawing}
													width="200px"
													alt="messageDrawing"
												/>
												<button onClick={clearMsgDrawing}>그림 제거하기</button>
											</div>
										)}
									</div>
								)}
							</>
						)}
					</Form>
				</div>
				<div className="editPaper-edit-btn">
					<Button size="lg" onClick={onMessageSubmit}>
						작성 완료
					</Button>
				</div>
			</div>
		</div>
	);
}

export default CreateMessage;
