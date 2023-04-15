import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authService, dbService, storageService } from "api/fbase";
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
import { useSelector } from "react-redux";

import { Row, Col, Card, Button } from "react-bootstrap";
import "./PaperList.css";

function PaperList() {
	const userId = useSelector((state) => state.userReducer.uid);
	const [papers, setPapers] = useState([]);

	useEffect(() => {
		const q = query(
			collection(dbService, "papers"),
			where("creatorId", "==", `${userId}`),
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
		<div className="paperList-container">
			<Row md={3} className="g-3">
				{papers &&
					papers.map((paper) => (
						<Col key={paper.id}>
							<Card className="paperList-card-container">
								<Card.Body>
									<Card.Title>
										<Link to={`/paper/${paper.id}`}>
											<h4>
												{paper.isPrivate && "🔒 "}
												{paper.paperName}
											</h4>
										</Link>
									</Card.Title>
									<Card.Text>{paper.createdAt}</Card.Text>
									{userId === paper.creatorId && (
										<Button
											variant="primary"
											onClick={() => deletePaper(paper)}
										>
											페이퍼 삭제
										</Button>
									)}
								</Card.Body>
							</Card>
						</Col>
					))}
			</Row>
		</div>
	);
}

export default PaperList;
