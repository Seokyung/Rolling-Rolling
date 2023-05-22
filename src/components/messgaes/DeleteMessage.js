import React from "react";
import { dbService, storageService } from "api/fbase";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import { Modal, Button, CloseButton } from "react-bootstrap";
import { message } from "antd";

function DeleteMessage({ deleteModal, setDeleteModal, msgObj }) {
	const [messageApi, contextHolder] = message.useMessage();
	const key = "updatable";

	const closeDeleteModal = () => {
		setDeleteModal(false);
	};

	const deleteMessage = async () => {
		await messageApi.open({
			key,
			type: "loading",
			content: "메세지 삭제중...",
			duration: 0.5,
		});

		try {
			const msgRef = doc(
				dbService,
				"papers",
				`${msgObj.paperId}`,
				"messages",
				`${msgObj.id}`
			);
			await deleteDoc(msgRef);

			if (msgObj.msgImg !== "") {
				const urlRef = ref(storageService, msgObj.msgImg);
				await deleteObject(urlRef);
			}

			messageApi.open({
				key,
				type: "success",
				content: "메세지가 삭제되었습니다!",
				duration: 2,
			});
		} catch (error) {
			messageApi.open({
				key,
				type: "error",
				content: "메세지 삭제에 실패하였습니다 😢",
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
						메세지를 삭제하시겠습니까?
					</Modal.Title>
					<CloseButton className="modal-close-btn" onClick={closeDeleteModal} />
				</Modal.Header>
				<Modal.Body className="deletePaper-modal-body">
					<Button
						id="delete-btn"
						variant="danger"
						size="lg"
						onClick={deleteMessage}
					>
						메세지 삭제
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

export default DeleteMessage;
