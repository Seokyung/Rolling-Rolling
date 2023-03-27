import React, { useRef, useState } from "react";
import { dbService, storageService } from "fbase";
import { collection, doc, setDoc } from "firebase/firestore";
import {
	ref,
	uploadBytes,
	uploadString,
	getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function CreateMessage({ paperId, userObj, setMsgModal }) {
	const imgInputRef = useRef(null);
	const [msgTitle, setMsgTitle] = useState("");
	const [msgWriter, setMsgWriter] = useState("");
	const [msgContent, setMsgContent] = useState("");
	const [msgImg, setMsgImg] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);

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

	const onMsgImgChange = (e) => {
		const {
			target: { files },
		} = e;
		const imgFile = files[0];
		const reader = new FileReader();
		if (imgFile) {
			reader.onload = (finishedEvent) => {
				const {
					currentTarget: { result },
				} = finishedEvent;
				setMsgImg(result);
			};
			reader.readAsDataURL(imgFile);
		}
	};

	const clearMsgImg = () => {
		imgInputRef.current.value = null;
		setMsgImg("");
	};

	const onMessageSubmit = async (e) => {
		e.preventDefault();
		if (msgTitle === "" || msgWriter === "") {
			alert("메세지 제목/작성자를 입력해주세요!");
			return;
		}
		let msgImgUrl = "";
		if (msgImg !== "") {
			const msgImgRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
			// await uploadBytes(msgImgRef, msgImg);
			const metadata = { customMetadata: { paperId: paperId } };
			await uploadString(msgImgRef, msgImg, "data_url", metadata);
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
				<label htmlFor="msgImgInput">
					<span>이미지 첨부</span>
				</label>
				<input
					type="file"
					id="msgImgInput"
					ref={imgInputRef}
					onChange={onMsgImgChange}
					accept="image/*"
					style={{ display: "none" }}
				/>
				{msgImg && (
					<div>
						<img src={msgImg} width="200px" />
						<button onClick={clearMsgImg}>이미지 제거하기</button>
					</div>
				)}
			</form>
		</div>
	);
}

export default CreateMessage;
