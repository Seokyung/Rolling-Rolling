import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authService, dbService, storageService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";
import {
	collection,
	query,
	where,
	orderBy,
	onSnapshot,
	doc,
	getDocs,
	deleteDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

function PaperList({ userObj }) {
	const [papers, setPapers] = useState([]);

	useEffect(() => {
		const q = query(
			collection(dbService, "papers"),
			where("creatorId", "==", `${userObj.uid}`),
			orderBy("createdAt", "desc")
		);
		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const paperArray = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setPapers(paperArray);
			},
			(error) => {
				alert(`Home: ${error.message}`);
				console.log(`Home: ${error}`);
			}
		);
		onAuthStateChanged(authService, (user) => {
			if (user === null) {
				unsubscribe();
			}
		});
	}, []);

	const deletePaper = async (paper) => {
		const isDelete = window.confirm(
			`${paper.paperName} 페이퍼를 삭제하시겠습니까?`
		);
		if (isDelete) {
			try {
				const msgQuery = query(
					collection(dbService, "papers", `${paper.id}`, "messages")
				);
				const msgSnapshot = await getDocs(msgQuery);
				msgSnapshot.forEach(async (msg) => {
					const msgRef = doc(
						dbService,
						"papers",
						`${paper.id}`,
						"messages",
						`${msg.id}`
					);
					if (msg.data().msgImg !== "") {
						const urlRef = ref(storageService, msg.data().msgImg);
						await deleteObject(urlRef);
					}
					await deleteDoc(msgRef);
				});
				const paperRef = doc(dbService, "papers", `${paper.id}`);
				await deleteDoc(paperRef);
				alert("페이퍼가 삭제되었습니다!");
			} catch (error) {
				console.log(error.message);
			}
		}
	};

	return (
		<div>
			{papers &&
				papers.map((paper) => (
					<div key={paper.id}>
						<Link to={`/paper/${paper.id}`}>
							<h4>
								{paper.isPrivate && "🔒"}
								{paper.paperName}
							</h4>
						</Link>
						{userObj.uid === paper.creatorId && (
							<button onClick={() => deletePaper(paper)}>페이퍼 삭제</button>
						)}
						{}
					</div>
				))}
		</div>
	);
}

export default PaperList;
