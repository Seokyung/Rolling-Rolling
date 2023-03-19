import React, { useState, useEffect } from "react";
import { authService, dbService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import CreatePaper from "components/papers/CreatePaper";
import Paper from "components/papers/Paper";

function Home({ userObj }) {
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
				alert(`Home: ${error.message}`);
			}
		);
		onAuthStateChanged(authService, (user) => {
			if (user === null) {
				unsubscribe();
			}
		});
	}, []);

	const showPaperModal = () => {
		setPaperModal((prev) => !prev);
	};

	return (
		<div>
			<h2>Home</h2>
			<button onClick={showPaperModal}>Paper 만들기</button>
			{paperModal && <CreatePaper userObj={userObj} />}
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
