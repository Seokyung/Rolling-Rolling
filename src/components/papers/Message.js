import React, { useState } from "react";

function Message({ setMsgModal }) {
	const [message, setMessage] = useState("");

	const onMessageChange = (e) => {
		const {
			target: { value },
		} = e;
		setMessage(value);
	};

	const onMessageSubmit = (e) => {
		e.preventDefault();
		if (message === "") {
			return;
		}
		setMsgModal((prev) => !prev);
	};

	return (
		<div>
			<h2>Message</h2>
			<form onSubmit={onMessageSubmit}>
				<input
					type="text"
					value={message}
					onChange={onMessageChange}
					placeholder="메세지를 입력하세요 :)"
				/>
				<input type="submit" value="메세지 붙이기" />
			</form>
		</div>
	);
}

export default Message;
