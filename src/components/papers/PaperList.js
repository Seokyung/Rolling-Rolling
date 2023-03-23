import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authService, dbService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";
import {
	collection,
	query,
	where,
	orderBy,
	onSnapshot,
	doc,
	deleteDoc,
} from "firebase/firestore";

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
			const paperRef = doc(dbService, "papers", `${paper.id}`);
			await deleteDoc(paperRef);
		}
	};

	return (
		<div>
			<h2>PaperList</h2>
			{papers.map((paper) => (
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
				</div>
			))}
		</div>
	);
}

export default PaperList;
