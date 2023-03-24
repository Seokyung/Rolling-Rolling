import React from "react";
import { dbService } from "fbase";
import { doc, deleteDoc } from "firebase/firestore";

function Message({ msgObj, isOwner }) {
	const deleteMessage = async (msgObj) => {
		const isDelete = window.confirm(
			`${msgObj.msgTitle} 메세지를 삭제하시겠습니까?`
		);
		if (isDelete) {
			const msgRef = doc(
				dbService,
				"papers",
				`${msgObj.paperId}`,
				"messages",
				`${msgObj.id}`
			);
			await deleteDoc(msgRef);
			alert("메세지가 삭제되었습니다!");
		}
	};

	return (
		<div>
			<h3>
				{msgObj.isPrivate && "🔒"}
				{msgObj.msgTitle}
			</h3>
			<h4>{msgObj.msgWriter}</h4>
			<p>{msgObj.msgContent}</p>
			{isOwner && (
				<button onClick={() => deleteMessage(msgObj)}>메세지 삭제</button>
			)}
		</div>
	);
}

export default Message;
