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

import { Skeleton } from "antd";
import { Row, Col, Card, Button, Pagination } from "react-bootstrap";
import "./PaperList.css";

function PaperList() {
	const userId = useSelector((state) => state.userReducer.uid);
	const [init, setInit] = useState(true);
	const [papers, setPapers] = useState([]);
	const [slicedPapers, setSlicedPapers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageArr, setPageArr] = useState([]);
	const papersPerPage = 5;

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
		setInit(false);
	}, []);

	useEffect(() => {
		const papersToShow = papers.slice(
			(currentPage - 1) * papersPerPage,
			currentPage * papersPerPage
		);
		let newPageArr = [];
		if (parseInt(papers.length % 5) === 0) {
			for (let i = 1; i <= parseInt(papers.length / 5); i++) {
				newPageArr.push(i);
			}
		} else {
			for (let i = 1; i <= parseInt(papers.length / 5) + 1; i++) {
				newPageArr.push(i);
			}
		}
		setSlicedPapers(papersToShow);
		setPageArr(newPageArr);
	}, [papers, currentPage]);

	const onPageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

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
		<>
			{init ? (
				<Skeleton active />
			) : (
				<>
					<Row md={1} className="g-4">
						{papers &&
							slicedPapers.map((paper) => (
								<Col key={paper.id}>
									<Card className="paperList-card-container">
										<Card.Body>
											<Card.Title>
												<Link
													to={`/paper/${paper.id}`}
													className="paperList-card-link"
												>
													<h4 className="paperList-card-title">
														{paper.isPrivate && "🔒"}
														{paper.paperName}
													</h4>
												</Link>
											</Card.Title>
											<Card.Text className="paperList-card-date">
												{paper.createdAt}
											</Card.Text>
											{userId === paper.creatorId && (
												<div className="paperList-card-btn-container">
													<Button
														className="paperList-card-delete-btn"
														variant="danger"
														onClick={() => deletePaper(paper)}
													>
														페이퍼 삭제
													</Button>
												</div>
											)}
										</Card.Body>
									</Card>
								</Col>
							))}
					</Row>
					<Pagination className="paperList-pagination-container" size="lg">
						{pageArr.map((pageNum) => (
							<Pagination.Item
								className="paperList-pagination-item"
								key={pageNum}
								active={pageNum === currentPage}
								onClick={() => onPageChange(pageNum)}
							>
								{pageNum}
							</Pagination.Item>
						))}
					</Pagination>
				</>
			)}
		</>
	);
}

export default PaperList;
