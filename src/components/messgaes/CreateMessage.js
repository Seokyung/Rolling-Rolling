import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dbService, storageService } from "api/fbase";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import MessageImage from "./MessageImage";
import MessageCanvas from "./MessageCanvas";
import { useSelector } from "react-redux";

import { Form, Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import { Divider } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAngleLeft,
	faEnvelope,
	faImage,
	faBrush,
} from "@fortawesome/free-solid-svg-icons";
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

	const onAttachmentTypeChange = (e) => {
		const {
			target: { value },
		} = e;
		setAttachment(value);
	};

	const openCanvasModal = () => {
		setCanvasModal(true);
	};

	const clearMsgDrawing = () => {
		setMsgDrawing("");
		setAttachment("");
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
			setAttachment("");
			setMsgImg("");
			setMsgDrawing("");
			closeCreateMessage();
		}
	};

	return (
		<>
			<div className="paper-wrapper">
				<div className="editPaper-container">
					<div className="editPaper-header-container">
						<button onClick={closeCreateMessage}>
							<FontAwesomeIcon icon={faAngleLeft} />
						</button>
						<div className="paper-title-container">
							<h2 className="createMessage-title">
								<FontAwesomeIcon
									className="icon-margin-right"
									icon={faEnvelope}
								/>
								메세지 작성하기
							</h2>
						</div>
					</div>
					<div className="editPaper-form-container">
						<Form noValidate validated={validated}>
							<Form.Group className="create-form-group">
								<Form.Label className="create-form-title">
									메세지 제목
								</Form.Label>
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
								<Form.Label className="create-form-title">
									메세지 내용
								</Form.Label>
								<Form.Control
									className="create-form-input"
									as="textarea"
									rows={5}
									name="content"
									value={msgContent}
									onChange={onMessageChange}
									placeholder="내용을 입력하세요 :)"
								/>
							</Form.Group>
							<Divider className="paper-divider" />
							<Form.Group className="create-form-group">
								<Form.Check type="checkbox" className="create-form-title">
									<Form.Check.Input
										type="checkbox"
										checked={isPrivate}
										onChange={onPrivateCheckChange}
									/>
									<Form.Check.Label>비공개</Form.Check.Label>
								</Form.Check>
								<Form.Text className="create-form-text">
									메세지의 공개여부를 설정해주세요
								</Form.Text>
								<Form.Text className="create-form-text-small">
									(비공개 메세지는 페이퍼 주인과 메세지 작성자만 볼 수 있어요🤫
									)
								</Form.Text>
							</Form.Group>
							<Divider className="paper-divider" />
							<Form.Group className="createMessage-button-group">
								<ButtonGroup>
									<ToggleButton
										className="createMessage-toggle-btn"
										type="radio"
										variant="outline-secondary"
										checked={attachment === "attachImage"}
										id="attachImage"
										value="attachImage"
										onChange={onAttachmentTypeChange}
									>
										<FontAwesomeIcon icon={faImage} />
										사진 첨부
									</ToggleButton>
									<ToggleButton
										className="createMessage-toggle-btn"
										type="radio"
										variant="outline-secondary"
										checked={attachment === "attachDrawing"}
										id="attachDrawing"
										value="attachDrawing"
										onChange={onAttachmentTypeChange}
									>
										<FontAwesomeIcon icon={faBrush} />
										그림 첨부
									</ToggleButton>
								</ButtonGroup>
								{
									<div className="createMessage-attach-group">
										{attachment === "attachImage" && (
											<MessageImage
												msgImg={msgImg}
												setMsgImg={setMsgImg}
												setAttachment={setAttachment}
											/>
										)}
										{attachment === "attachDrawing" && (
											<>
												<button
													onClick={(e) => {
														e.preventDefault();
														openCanvasModal();
													}}
												>
													그림 그리기
												</button>
												{msgDrawing && (
													<div>
														<img
															src={msgDrawing}
															width="200px"
															alt="messageDrawing"
														/>
														<button onClick={clearMsgDrawing}>
															그림 제거하기
														</button>
													</div>
												)}
											</>
										)}
									</div>
								}
							</Form.Group>

							<Divider className="paper-divider" />
							<div className="editPaper-edit-btn">
								<Button size="lg" onClick={onMessageSubmit}>
									작성 완료
								</Button>
							</div>
						</Form>
					</div>
				</div>
			</div>
			{canvasModal && (
				<MessageCanvas
					canvasModal={canvasModal}
					setCanvasModal={setCanvasModal}
					setMsgDrawing={setMsgDrawing}
					setAttachment={setAttachment}
				/>
			)}
		</>
	);
}

export default CreateMessage;
