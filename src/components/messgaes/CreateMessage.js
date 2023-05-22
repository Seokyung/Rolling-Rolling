import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dbService, storageService } from "api/fbase";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import MessageImage from "./MessageImage";
import MessageDrawing from "./MessageDrawing";
import { useSelector } from "react-redux";

import {
	Form,
	Button,
	ButtonGroup,
	ToggleButton,
	Collapse,
} from "react-bootstrap";
import { Divider, Button as CircleBtn, Image, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAngleLeft,
	faEnvelope,
	faImage,
	faPalette,
	faBrush,
	faXmark,
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

	const msgTitleRef = useRef();
	const msgWriterRef = useRef();

	const [currentTitleLength, setCurrentTitleLength] = useState(0);
	const maxTitleLength = 50;

	const [currentWriterLength, setCurrentWriterLength] = useState(
		useSelector((state) => state.userReducer.displayName).length
	);
	const maxWriterLength = 30;

	const [currentContentLength, setCurrentContentLength] = useState(0);
	const maxContentLength = 500;

	const [attachOpen, setAttachOpen] = useState(false);
	const [canvasModal, setCanvasModal] = useState(false);

	const [validated, setValidated] = useState(false);

	const [messageApi, contextHolder] = message.useMessage();
	const key = "updatable";

	const closeCreateMessage = () => {
		navigate(`/paper/${paperId}`, { replace: true });
	};

	const onMessageChange = (e) => {
		const {
			target: { name, value },
		} = e;
		if (name === "title") {
			setMsgTitle(value);
			setCurrentTitleLength(value.length);
		} else if (name === "writer") {
			setMsgWriter(value);
			setCurrentWriterLength(value.length);
		} else if (name === "content") {
			setMsgContent(value);
			setCurrentContentLength(value.length);
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
		setAttachOpen(true);
	};

	const openCanvasModal = () => {
		setCanvasModal(true);
	};

	const clearMsgDrawing = () => {
		setMsgDrawing("");
	};

	const closeAttach = () => {
		setAttachOpen(false);
		setMsgImg("");
		setMsgDrawing("");
	};

	const onMessageSubmit = async (e) => {
		e.preventDefault();

		if (msgTitle === "") {
			msgTitleRef.current.focus();
			setValidated(true);
			return;
		}
		if (msgWriter === "") {
			msgWriterRef.current.focus();
			setValidated(true);
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

		await messageApi.open({
			key,
			type: "loading",
			content: "메세지 게시중...",
			duration: 0.5,
		});

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
			messageApi.open({
				key,
				type: "success",
				content: `${msgTitle} 메세지가 게시되었습니다!`,
				duration: 2,
			});
		} catch (error) {
			messageApi.open({
				key,
				type: "error",
				content: "메세지 게시에 실패하였습니다 😢",
				duration: 2,
			});
			console.log(error.code);
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
			{contextHolder}
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
								메세지 쓰기
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
									ref={msgTitleRef}
									maxLength={maxTitleLength}
									onChange={onMessageChange}
									placeholder="제목을 입력하세요 :)"
								/>
								<Form.Control.Feedback
									className="create-form-feedback"
									type="invalid"
								>
									메세지 제목을 입력해주세요!
								</Form.Control.Feedback>
								<Form.Text className="create-form-length-text">
									{currentTitleLength} / {maxTitleLength}
								</Form.Text>
							</Form.Group>
							<Form.Group className="create-form-group">
								<Form.Label className="create-form-title">작성자</Form.Label>
								<Form.Control
									className="create-form-input"
									type="text"
									name="writer"
									required
									value={msgWriter}
									ref={msgWriterRef}
									maxLength={maxWriterLength}
									onChange={onMessageChange}
									placeholder="이름을 입력하세요 :)"
								/>
								<Form.Control.Feedback
									className="create-form-feedback"
									type="invalid"
								>
									작성자를 입력해주세요!
								</Form.Control.Feedback>
								<Form.Text className="create-form-length-text">
									{currentWriterLength} / {maxWriterLength}
								</Form.Text>
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
									maxLength={maxContentLength}
									onChange={onMessageChange}
									placeholder="내용을 입력하세요 :)"
								/>
								<Form.Text className="create-form-length-text">
									{currentContentLength} / {maxContentLength}
								</Form.Text>
							</Form.Group>
							<Divider className="paper-divider" />
							<Form.Group className="create-form-group">
								<Form.Check type="checkbox" className="create-form-title">
									<Form.Check.Input
										type="checkbox"
										checked={isPrivate}
										onChange={onPrivateCheckChange}
									/>
									<Form.Check.Label>🔒 비공개 메세지</Form.Check.Label>
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
								{
									<Collapse in={attachOpen}>
										<div className="createMessage-attach-group">
											{attachment === "attachImage" && (
												<MessageImage
													msgImg={msgImg}
													setMsgImg={setMsgImg}
													closeAttach={closeAttach}
												/>
											)}
											{attachment === "attachDrawing" && (
												<div className="msgImg-wrapper">
													{msgDrawing ? (
														<div className="msgImg-container">
															<div className="msgImg-img-container">
																<Image
																	src={msgDrawing}
																	className="msgImg-img"
																	alt="messageDrawing"
																/>
																<CircleBtn
																	shape="circle"
																	className="upload-close-btn img-close"
																	onClick={clearMsgDrawing}
																>
																	<FontAwesomeIcon icon={faXmark} />
																</CircleBtn>
															</div>
														</div>
													) : (
														<div className="msgImg-container">
															<div
																className="msgImg-upload-container"
																onClick={openCanvasModal}
															>
																<FontAwesomeIcon icon={faPalette} />
																클릭해서 그림을 그려보세요
															</div>
															<CircleBtn
																shape="circle"
																className="upload-close-btn file-close"
																onClick={closeAttach}
															>
																<FontAwesomeIcon icon={faXmark} />
															</CircleBtn>
														</div>
													)}
												</div>
											)}
										</div>
									</Collapse>
								}
								<ButtonGroup>
									<ToggleButton
										className="createMessage-toggle-btn"
										type="radio"
										variant="outline-secondary"
										checked={attachment === "attachImage" && attachOpen}
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
										checked={attachment === "attachDrawing" && attachOpen}
										id="attachDrawing"
										value="attachDrawing"
										onChange={onAttachmentTypeChange}
									>
										<FontAwesomeIcon icon={faBrush} />
										그림 첨부
									</ToggleButton>
								</ButtonGroup>
							</Form.Group>
							<Divider className="paper-divider" />
							<div className="editPaper-edit-btn">
								<Button size="lg" onClick={onMessageSubmit}>
									메세지 게시하기
								</Button>
								<Button
									id="close-btn"
									variant="outline-secondary"
									size="lg"
									onClick={closeCreateMessage}
								>
									닫기
								</Button>
							</div>
						</Form>
					</div>
				</div>
			</div>
			{canvasModal && (
				<MessageDrawing
					canvasModal={canvasModal}
					setCanvasModal={setCanvasModal}
					setMsgDrawing={setMsgDrawing}
				/>
			)}
		</>
	);
}

export default CreateMessage;
