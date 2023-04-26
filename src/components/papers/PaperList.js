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

import { Skeleton, Empty, message, Tooltip, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
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
	const papersPerPage = 6;

	const [messageApi, contextHolder] = message.useMessage();
	const key = "updatable";

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
	}, [papers, currentPage]);

	const onPageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const deletePaper = async (paper) => {
		messageApi.open({
			key,
			type: "loading",
			content: "페이지 삭제중...",
		});
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
			messageApi.open({
				key,
				type: "success",
				content: "페이퍼가 삭제되었습니다!",
				duration: 2,
			});
		} catch (error) {
			messageApi.open({
				key,
				type: "error",
				content: "페이퍼 삭제에 실패하였습니다 😢",
				duration: 2,
			});
			console.log(error.code);
		}
	};

	return (
		<>
			{init ? (
				<Skeleton active />
			) : (
				<>
					{contextHolder}
					{isPapers ? (
						<>
							<Row sm={1} md={1} lg={2} xl={3} className="g-4">
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
															{paper.isPrivate && "🔒"}
															{paper.paperName}
														</h4>
													</Card.Title>
												</Link>
												<Card.Text className="paperList-card-date">
													{paper.createdAt}
												</Card.Text>
												{userId === paper.creatorId && (
													<Popconfirm
														placement="left"
														title="페이퍼 삭제"
														description="페이퍼를 삭제하시겠습니까?"
														onConfirm={() => deletePaper(paper)}
														okText="삭제"
														okType="danger"
														cancelText="취소"
														icon={
															<QuestionCircleOutlined
																style={{
																	color: "red",
																}}
															/>
														}
													>
														<Tooltip title="페이퍼 삭제">
															<button className="paperList-card-delete-btn">
																<FontAwesomeIcon icon={faTrash} />
															</button>
														</Tooltip>
													</Popconfirm>
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
