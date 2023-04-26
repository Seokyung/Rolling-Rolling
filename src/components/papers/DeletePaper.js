import React from "react";
import { useNavigate } from "react-router-dom";
import { dbService, storageService } from "api/fbase";
import { doc, deleteDoc, query, collection, getDocs } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useSelector } from "react-redux";

import { Modal, Button } from "react-bootstrap";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./DeletePaper.css";

function DeletePaper({ deleteModal, setDeleteModal }) {
	const paperId = useSelector((state) => state.paperReducer.paperId);
	const navigate = useNavigate();

	const [messageApi, contextHolder] = message.useMessage();
	const key = "updatable";

	const closeDeleteModal = () => {
		setDeleteModal(false);
	};

	const deletePaper = async () => {
		messageApi.open({
			key,
			type: "loading",
			content: "페이지 삭제중...",
		});

		try {
			const msgQuery = query(
				collection(dbService, "papers", `${paperId}`, "messages")
			);
			const msgSnapshot = await getDocs(msgQuery);
			msgSnapshot.forEach(async (msg) => {
				const msgRef = doc(
					dbService,
					"papers",
					`${paperId}`,
					"messages",
					`${msg.id}`
				);
				if (msg.data().msgImg !== "") {
					const urlRef = ref(storageService, msg.data().msgImg);
					await deleteObject(urlRef);
				}
				await deleteDoc(msgRef);
			});
			const paperRef = doc(dbService, "papers", `${paperId}`);
			await deleteDoc(paperRef);
			messageApi.open({
				key,
				type: "success",
				content: "페이퍼가 삭제되었습니다!",
				duration: 2,
			});
			navigate("/", { replace: true });
		} catch (error) {
			messageApi.open({
				key,
				type: "error",
				content: "페이퍼 삭제에 실패하였습니다 😢",
				duration: 2,
			});
			console.log(error.code);
		} finally {
			setDeleteModal(false);
		}
	};

	return (
		<>
			{contextHolder}
			<Modal
				show={deleteModal}
				onHide={closeDeleteModal}
				onExit={closeDeleteModal}
				centered
				animation={true}
			>
				<Modal.Header className="deletePaper-modal-header">
					<Modal.Title className="deletePaper-modal-title">
						페이퍼를 삭제하시겠습니까?
					</Modal.Title>
					<button
						className="deletePaper-modal-close-btn"
						onClick={closeDeleteModal}
					>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</Modal.Header>
				<Modal.Body className="deletePaper-modal-body">
					<Button id="delete-btn" size="lg" onClick={deletePaper}>
						페이퍼 삭제하기
					</Button>
					<Button
						id="close-btn"
						variant="secondary"
						size="lg"
						onClick={closeDeleteModal}
					>
						닫기
					</Button>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default DeletePaper;