import React from "react";
import { dbService, storageService } from "fbase";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

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
			if (msgObj.msgImg !== "") {
				const urlRef = ref(storageService, msgObj.msgImg);
				await deleteObject(urlRef);
			}
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
			{msgObj.msgImg && (
				<a href={msgObj.msgImg} target="_blank" rel="noopener noreferrer">
					<img src={msgObj.msgImg} width="150px" />
				</a>
			)}
			{isOwner && (
				<button onClick={() => deleteMessage(msgObj)}>메세지 삭제</button>
			)}
		</div>
	);
}

export default Message;
