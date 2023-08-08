import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "api/fbase";
import { signOut } from "firebase/auth";

import { Modal, Button, CloseButton } from "react-bootstrap";
import { message } from "antd";

function LogOutModal({ logOutModal, setLogOutModal }) {
	const navigate = useNavigate();

	const [messageApi, contextHolder] = message.useMessage();
	const key = "updatable";

	const closeLogOutModal = () => {
		setLogOutModal(false);
	};

	const onLogoutClick = async () => {
		await messageApi.open({
			key,
			type: "loading",
			content: "로그아웃 중...",
			className: "alert-message-container",
			duration: 0.5,
		});

		try {
			await signOut(authService);
			messageApi.open({
				key,
				type: "success",
				content: "로그아웃 되었습니다!",
				className: "alert-message-container",
				duration: 2,
			});
			navigate("/", { replace: true });
		} catch (error) {
			messageApi.open({
				key,
				type: "error",
				content: "로그아웃에 실패하였습니다 😢",
				className: "alert-message-container",
				duration: 2,
			});
			console.log(error.code);
		} finally {
			window.scrollTo({ top: 0, behavior: "smooth" });
			closeLogOutModal();
		}
	};

	return (
		<>
			{contextHolder}
			<Modal
				show={logOutModal}
				onHide={closeLogOutModal}
				onExit={closeLogOutModal}
				centered
				animation={true}
			>
				<Modal.Header className="delete-modal-header">
					<Modal.Title className="delete-modal-title">
						로그아웃 하시겠습니까?
					</Modal.Title>
					<CloseButton className="modal-close-btn" onClick={closeLogOutModal} />
				</Modal.Header>
				<Modal.Body className="delete-modal-body">
					<Button id="delete-btn" onClick={onLogoutClick}>
						로그아웃하기
					</Button>
					<Button id="close-btn" variant="secondary" onClick={closeLogOutModal}>
						닫기
					</Button>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default LogOutModal;
