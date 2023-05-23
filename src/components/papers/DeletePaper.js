import React from "react";
import { useNavigate } from "react-router-dom";
import { dbService, storageService } from "api/fbase";
import { doc, deleteDoc, query, collection, getDocs } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import { Modal, Button, CloseButton } from "react-bootstrap";
import { message } from "antd";
import "./DeletePaper.css";

function DeletePaper({ deleteModal, setDeleteModal, paperId }) {
	const navigate = useNavigate();

	const [messageApi, contextHolder] = message.useMessage();
	const key = "updatable";

	const closeDeleteModal = () => {
		setDeleteModal(false);
	};

	const deletePaper = async () => {
		await messageApi.open({
			key,
			type: "loading",
			content: "페이퍼 삭제중...",
			duration: 0.5,
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
				<Modal.Header className="delete-modal-header">
					<Modal.Title className="delete-modal-title">
						페이퍼를 삭제하시겠습니까?
					</Modal.Title>
					<CloseButton className="modal-close-btn" onClick={closeDeleteModal} />
				</Modal.Header>
				<Modal.Body className="delete-modal-body">
					<Button
						id="delete-btn"
						variant="danger"
						size="lg"
						onClick={deletePaper}
					>
						페이퍼 삭제
					</Button>
					<Button
						id="close-btn"
						variant="outline-secondary"
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
