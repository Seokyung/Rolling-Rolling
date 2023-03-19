import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { dbService } from "fbase";
import { doc, getDoc } from "firebase/firestore";
import Message from "../messgaes/Message";

function Paper({ userObj }) {
	// const [messages, setMessages] = useState([]);
	const { paperId } = useParams();
	const [paperName, setPaperName] = useState("");
	const [msgModal, setMsgModal] = useState(false);

	const getPaper = async () => {
		const paper = doc(dbService, "papers", `${paperId}`);
		const paperSnap = await getDoc(paper);
		if (paperSnap.exists()) {
			setPaperName(paperSnap.data().paperName);
			//console.log("data: ", paperSnap.data());
		} else {
			console.log("No Doc!");
		}
	};

	useEffect(() => {
		getPaper();
	}, []);

	const showMsgModal = () => {
		setMsgModal((prev) => !prev);
	};

	return (
		<div>
			<h4>{paperName}</h4>
			{/* <div>
				{messages.map((message) => (
					<Message />
				))}
			</div>
			<button onClick={showMsgModal}>메세지 작성하기</button>
			{msgModal && <CreateMessage setMsgModal={setMsgModal} />} */}
		</div>
	);
}

export default Paper;
