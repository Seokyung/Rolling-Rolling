import React, { useState } from "react";
import CreateMessage from "../messgaes/CreateMessage";
import Message from "../messgaes/Message";

function Paper() {
	const [messages, setMessages] = useState([]);
	const [msgModal, setMsgModal] = useState(false);

	const showMsgModal = () => {
		setMsgModal((prev) => !prev);
	};

	return (
		<div>
			<h2>Paper</h2>
			<div>
				{messages.map((message) => (
					<Message />
				))}
			</div>
			<button onClick={showMsgModal}>메세지 작성하기</button>
			{msgModal && <CreateMessage setMsgModal={setMsgModal} />}
		</div>
	);
}

export default Paper;
