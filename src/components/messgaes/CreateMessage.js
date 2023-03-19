import React, { useState } from "react";
import { dbService } from "fbase";
import { collection, doc, setDoc } from "firebase/firestore";

function CreateMessage({ setMsgModal }) {
	const [message, setMessage] = useState("");

	const onMessageChange = (e) => {
		const {
			target: { value },
		} = e;
		setMessage(value);
	};

	const onMessageSubmit = async (e) => {
		e.preventDefault();
		if (message === "") {
			return;
		}
		const paperId = "paperID";
		const msgObj = {
			text: message,
			createdAt: Date.now(),
		};
		try {
			const newMessage = doc(collection(dbService, `${paperId}`));
			await setDoc(newMessage, msgObj);
		} catch (error) {
			alert(error.message);
			console.log(error);
		}
		setMsgModal((prev) => !prev);
	};

	return (
		<div>
			<h2>Create Message</h2>
			<form onSubmit={onMessageSubmit}>
				<input
					type="text"
					autoFocus
					value={message}
					onChange={onMessageChange}
					placeholder="메세지를 입력하세요 :)"
				/>
				<input type="submit" value="메세지 붙이기" />
			</form>
		</div>
	);
}

export default CreateMessage;
