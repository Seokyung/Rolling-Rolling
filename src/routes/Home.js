import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import CreatePaper from "components/papers/CreatePaper";
import Paper from "components/papers/Paper";

function Home() {
	const [papers, setPapers] = useState([]);
	const [paperModal, setPaperModal] = useState(false);

	useEffect(() => {
		const q = query(
			collection(dbService, "papers"),
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
				setPaperModal(false);
			},
			(error) => {
				alert(error.message);
			}
		);
	}, []);

	const showPaperModal = () => {
		setPaperModal((prev) => !prev);
	};

	return (
		<div>
			<h2>Home</h2>
			<button onClick={showPaperModal}>Paper 만들기</button>
			{paperModal && <CreatePaper />}
			<div>
				{papers.map((paper) => (
					<div key={paper.id}>
						<h4>{paper.paperName}</h4>
					</div>
				))}
			</div>
		</div>
	);
}

export default Home;
