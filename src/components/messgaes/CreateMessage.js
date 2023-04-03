import React, { useState } from "react";
import { dbService, storageService } from "api/fbase";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import MessageImage from "./MessageImage";
import MessageCanvas from "./MessageCanvas";
import { useSelector } from "react-redux";

function CreateMessage({ paperId, setMsgModal }) {
	const userId = useSelector((state) => state.userReducer.uid);
	const [msgTitle, setMsgTitle] = useState("");
	const [msgWriter, setMsgWriter] = useState("");
	const [msgContent, setMsgContent] = useState("");
	const [isAttachment, setIsAttachment] = useState(false);
	const [attachment, setAttachment] = useState("");
	const [msgImg, setMsgImg] = useState("");
	const [msgDrawing, setMsgDrawing] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [canvasModal, setCanvasModal] = useState(false);

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
			alert("메세지 제목/작성자를 입력해주세요!");
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
		const newMsg = doc(
			collection(dbService, "papers", `${paperId}`, "messages")
		);
		const msgObj = {
			paperId: paperId,
			msgTitle: msgTitle,
			msgWriter: msgWriter,
			msgContent: msgContent,
			msgImg: msgImgUrl,
			createdAt: Date.now(),
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
			setMsgModal((prev) => !prev);
		}
	};

	return (
		<div>
			<h2>Create Message</h2>
			<form onSubmit={onMessageSubmit}>
				<div>
					<input
						type="text"
						autoFocus
						name="title"
						value={msgTitle}
						onChange={onMessageChange}
						placeholder="제목을 입력하세요 :)"
					/>
					<input
						type="text"
						name="writer"
						value={msgWriter}
						onChange={onMessageChange}
						placeholder="이름을 입력하세요 :)"
					/>
					<input
						type="text"
						name="content"
						value={msgContent}
						onChange={onMessageChange}
						placeholder="내용을 입력하세요 :)"
					/>
					<input
						type="checkbox"
						checked={isPrivate}
						onChange={onPrivateCheckChange}
					/>
					<label htmlFor="isPrivate">비공개</label>
					<input type="submit" value="메세지 올리기" />
				</div>
			</form>
			<input
				type="checkbox"
				checked={isAttachment}
				onChange={onAttachmentChange}
			/>
			<label htmlFor="isAttachment">첨부파일</label>
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
									<img src={msgDrawing} width="200px" alt="messageDrawing" />
									<button onClick={clearMsgDrawing}>그림 제거하기</button>
								</div>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default CreateMessage;
