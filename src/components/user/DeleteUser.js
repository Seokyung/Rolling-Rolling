import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { authService, dbService, storageService } from "api/fbase";
import { deleteUser } from "firebase/auth";
import {
	doc,
	deleteDoc,
	query,
	collection,
	getDocs,
	where,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import { Modal, Button, CloseButton } from "react-bootstrap";
import { message } from "antd";

function DeleteUser({ deleteModal, setDeleteModal }) {
	const userObj = useSelector((state) => state.userReducer);

	const navigate = useNavigate();

	const [messageApi, contextHolder] = message.useMessage();
	const key = "updatable";

	const closeDeleteModal = () => {
		setDeleteModal(false);
	};

	const deletePaperData = async () => {
		try {
			const paperQuery = query(
				collection(dbService, "papers"),
				where("creatorId", "==", `${userObj.uid}`)
			);
			const paperSnapshot = await getDocs(paperQuery);
			paperSnapshot.forEach(async (paper) => {
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
			});
		} catch (error) {
			console.log(error.code);
		}
	};

	const deleteProfileImgData = async () => {
		const urlRef = ref(storageService, `${userObj.uid}/profileImg`);
		await deleteObject(urlRef);
	};

	const deleteAccount = async () => {
		try {
			deletePaperData();
			deleteProfileImgData();
			alert(
				`회원 탈퇴 되었습니다!\n\n그동안 Rolling-Rolling을 애용해주셔서 감사합니다 :)\n필요할 땐 언제든 다시 찾아주세요♡`
			);
			navigate("/", { replace: true });
		} catch (error) {
			alert(error.message);
		} finally {
			const user = authService.currentUser;
			await deleteUser(user);
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
					<Modal.Title className="delete-modal-title-danger">
						정말로 회원을 탈퇴하시겠습니까?
						<span>회원 탈퇴시 그동안의 데이터도 모두 삭제됩니다.</span>
					</Modal.Title>
					<CloseButton className="modal-close-btn" onClick={closeDeleteModal} />
				</Modal.Header>
				<Modal.Body className="delete-modal-body">
					<Button
						id="delete-btn"
						variant="outline-danger"
						size="lg"
						onClick={deleteAccount}
					>
						회원 탈퇴
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

export default DeleteUser;
