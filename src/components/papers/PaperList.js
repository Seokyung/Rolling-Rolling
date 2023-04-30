import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authService, dbService } from "api/fbase";
import { onAuthStateChanged } from "firebase/auth";
import {
	collection,
	query,
	where,
	orderBy,
	onSnapshot,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import useDebounce from "modules/useDebounce";
import DeletePaper from "./DeletePaper";

import { Skeleton, Empty } from "antd";
import { Row, Col, Card, Pagination } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./PaperList.css";

function PaperList() {
	const userId = useSelector((state) => state.userReducer.uid);

	const [init, setInit] = useState(true);
	const [isPapers, setIsPapers] = useState(false);

	const [papers, setPapers] = useState([]);
	const [slicedPapers, setSlicedPapers] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [pageArr, setPageArr] = useState([]);

	const [papersPerPage, setPapersPerPage] = useState(
		parseInt(
			getComputedStyle(document.documentElement).getPropertyValue(
				"--papers-per-page"
			)
		)
	);
	const debouncedPapersPerPage = useDebounce(papersPerPage, 500);

	const [deleteModal, setDeleteModal] = useState(false);
	const [paperListId, setPaperListId] = useState("");

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
				if (paperArray.length !== 0) {
					setIsPapers(true);
				} else {
					setIsPapers(false);
				}
				setPapers(paperArray);
				setInit(false);
			},
			(error) => {
				console.log(error.code);
			}
		);
		onAuthStateChanged(authService, (user) => {
			if (user === null) {
				unsubscribe();
			}
		});

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleResize = () => {
		if (window.screen.width > 1199) {
			setPapersPerPage(12);
		} else if (window.screen.width > 991) {
			setPapersPerPage(10);
		} else {
			setPapersPerPage(6);
		}
	};

	useEffect(() => {
		const papersToShow = papers.slice(
			(currentPage - 1) * papersPerPage,
			currentPage * papersPerPage
		);
		let newPageArr = [];
		if (parseInt(papers.length % papersPerPage) === 0) {
			for (let i = 1; i <= parseInt(papers.length / papersPerPage); i++) {
				newPageArr.push(i);
			}
		} else {
			for (let i = 1; i <= parseInt(papers.length / papersPerPage) + 1; i++) {
				newPageArr.push(i);
			}
		}
		setSlicedPapers(papersToShow);
		setPageArr(newPageArr);
	}, [papers, currentPage, debouncedPapersPerPage]);

	const onPageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const openDeleteModal = (paperId) => {
		setDeleteModal(true);
		setPaperListId(paperId);
	};

	return (
		<>
			{init ? (
				<Skeleton active />
			) : (
				<>
					{isPapers ? (
						<>
							<Row xs={1} sm={1} md={1} lg={2} xl={3} className="g-4">
								{slicedPapers.map((paper) => (
									<Col key={paper.id}>
										<Card className="paperList-card-container">
											<Card.Body>
												<Link
													to={
														paper.isPrivate
															? `/paper/private/${paper.id}`
															: `/paper/${paper.id}`
													}
													className="paperList-card-link"
												>
													<Card.Title>
														<h4 className="paperList-card-title">
															{paper.isPrivate && (
																<span className="private-icon">🔒</span>
															)}
															{paper.paperName}
														</h4>
													</Card.Title>
												</Link>
												<Card.Text className="paperList-card-date">
													{paper.createdAt}
												</Card.Text>
												{userId === paper.creatorId && (
													<div className="paperList-card-delete-btn">
														<button onClick={() => openDeleteModal(paper.id)}>
															<FontAwesomeIcon icon={faTrash} />
														</button>
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
							<DeletePaper
								deleteModal={deleteModal}
								setDeleteModal={setDeleteModal}
								paperId={paperListId}
							/>
						</>
					) : (
						<Empty
							description={
								<span className="empty-text">
									아직 페이퍼가 없네요!
									<br />
									페이퍼를 생성해보세요 😉
								</span>
							}
						/>
					)}
				</>
			)}
		</>
	);
}

export default PaperList;
