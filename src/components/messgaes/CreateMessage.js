import React, { useState } from "react";
import { dbService } from "fbase";
import { collection, doc, setDoc } from "firebase/firestore";

function CreateMessage({ setMsgModal, paperId }) {
	const [msgTitle, setMsgTitle] = useState("");
	const [msgWriter, setMsgWriter] = useState("");
	const [msgContent, setMsgContent] = useState("");

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

	const onMessageSubmit = async (e) => {
		e.preventDefault();
		if (msgTitle === "" && msgWriter === "") {
			return;
		}
		const newMsg = doc(
			collection(dbService, "papers", `${paperId}`, "messages")
		);
		const msgObj = {
			paperId: paperId,
			msgTitle: msgTitle,
			msgWriter: msgWriter,
			msgContent: msgContent,
			createdAt: Date.now(),
		};
		try {
			await setDoc(newMsg, msgObj);
			alert(`${msgTitle} 메세지가 작성되었습니다!`);
		} catch (error) {
			alert("메세지 작성에 실패하였습니다 :(");
			console.log(error);
		}
		setMsgTitle("");
		setMsgWriter("");
		setMsgContent("");
		setMsgModal((prev) => !prev);
	};

	return (
		<div>
			<h2>Create Message</h2>
			<form onSubmit={onMessageSubmit}>
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
				<input type="submit" value="메세지 붙이기" />
			</form>
		</div>
	);
}

export default CreateMessage;
