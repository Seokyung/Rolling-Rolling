import React, { useState } from "react";
import Message from "./Message";

function Paper() {
	const [msgModal, setMsgModal] = useState(false);

	const showMsgModal = () => {
		setMsgModal((prev) => !prev);
	};

	return (
		<div>
			<h2>Paper</h2>
			<button onClick={showMsgModal}>메세지 작성하기</button>
			{msgModal && <Message setMsgModal={setMsgModal} />}
		</div>
	);
}

export default Paper;
