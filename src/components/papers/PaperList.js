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
import { Row, Col, Card, Badge, Button, Pagination } from "react-bootstrap";
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

	const [rowNum, setRowNum] = useState([]);
	const [colNum, setColNum] = useState(0);
	const [papersPerPage, setPapersPerPage] = useState(
		parseInt(
			getComputedStyle(document.documentElement).getPropertyValue(
				"--papers-per-page"
			)
		)
	);
	const debouncedPapersPerPage = useDebounce(papersPerPage, 500);

	const [deleteModal, setDeleteModal] = useState(false);
	const [deletePaperId, setDeletePaperId] = useState("");

	useEffect(() => {
		const q = query(
			collection(dbService, "papers"),
			where("creatorId", "==", `${userId}`),
			orderBy("createdAt", "desc")
		);
		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const paperArray = snapshot.docs.map((doc, idx) => ({
					id: doc.id,
					paperIdx: idx,
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

		if (window.innerWidth > 1200) {
			setColNum(3);
			setPapersPerPage(12);
		} else if (window.innerWidth > 768) {
			setColNum(2);
			setPapersPerPage(10);
		} else {
			setColNum(1);
			setPapersPerPage(6);
		}

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleResize = () => {
		if (window.innerWidth > 1200) {
			setColNum(3);
			setPapersPerPage(12);
		} else if (window.innerWidth > 768) {
			setColNum(2);
			setPapersPerPage(10);
		} else {
			setColNum(1);
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

		let newRowNum = [];
		if (parseInt(papersToShow.length % colNum) === 0) {
			for (let i = 0; i < parseInt(papersToShow.length / colNum); i++) {
				newRowNum.push(i);
			}
		} else {
			for (let i = 0; i < parseInt(papersToShow.length / colNum) + 1; i++) {
				newRowNum.push(i);
			}
		}
		setRowNum(newRowNum);
	}, [papers, currentPage, debouncedPapersPerPage]);

	const renderPaperRows = () => {
		return rowNum.map((rowIdx) => {
			return (
				<Row key={rowIdx}>
					{slicedPapers
						.slice(rowIdx * colNum, (rowIdx + 1) * colNum)
						.map((paper, idx) => (
							<Col key={paper.id} className="paperList-col-container">
								<Link
									to={
										paper.isPrivate
											? `/paper/private/${paper.id}`
											: `/paper/${paper.id}`
									}
									className="paperList-card-link"
								>
									<Card className="paperList-card-container">
										<Card.Body>
											<Card.Text className="paperList-card-badge">
												<Badge id="grey-background">
													{papers.length - paper.paperIdx}번째 페이퍼
												</Badge>
												{paper.isPrivate && (
													<Badge bg="warning" text="dark">
														<span id="badge-icon">🔒</span>비공개
													</Badge>
												)}
											</Card.Text>
											<Card.Title>
												<span className="paperList-card-title">
													{paper.isPrivate && (
														<span className="private-icon">🔒</span>
													)}
													{paper.paperName}
												</span>
											</Card.Title>
											<div className="paperList-card-info">
												<Card.Text className="paperList-card-date">
													{paper.createdAt}
												</Card.Text>
												{userId === paper.creatorId && (
													<Button
														className="paperList-card-delete-btn"
														variant="outline-danger"
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															openDeleteModal(paper.id);
														}}
													>
														<FontAwesomeIcon icon={faTrash} />
													</Button>
												)}
											</div>
										</Card.Body>
									</Card>
								</Link>
							</Col>
						))}
				</Row>
			);
		});
	};

	const onPageChange = (pageNumber) => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		setCurrentPage(pageNumber);
	};

	const openDeleteModal = (paperId) => {
		setDeleteModal(true);
		setDeletePaperId(paperId);
	};

	return (
		<>
			{init ? (
				<Skeleton active />
			) : (
				<>
					{isPapers ? (
						<>
							{renderPaperRows()}
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
								paperId={deletePaperId}
							/>
						</>
					) : (
						<Empty
							description={
								<div className="empty-container">
									<span className="empty-text">아직 페이퍼가 없네요!</span>
									<span className="empty-text">페이퍼를 만들어보세요 😉</span>
								</div>
							}
						/>
					)}
				</>
			)}
		</>
	);
}

export default PaperList;
