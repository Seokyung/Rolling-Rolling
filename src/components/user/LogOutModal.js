import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "api/fbase";
import { signOut } from "firebase/auth";

import { Modal, Button } from "react-bootstrap";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

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
			duration: 0.5,
		});

		try {
			await signOut(authService);
			messageApi.open({
				key,
				type: "success",
				content: "로그아웃 되었습니다!",
				duration: 2,
			});
			navigate("/", { replace: true });
		} catch (error) {
			messageApi.open({
				key,
				type: "error",
				content: "로그아웃에 실패하였습니다 😢",
				duration: 2,
			});
			console.log(error.code);
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
				<Modal.Header className="deletePaper-modal-header">
					<Modal.Title className="deletePaper-modal-title">
						로그아웃 하시겠습니까?
					</Modal.Title>
					<button
						className="deletePaper-modal-close-btn"
						onClick={closeLogOutModal}
					>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</Modal.Header>
				<Modal.Body className="deletePaper-modal-body">
					<Button id="delete-btn" size="lg" onClick={onLogoutClick}>
						로그아웃하기
					</Button>
					<Button
						id="close-btn"
						variant="secondary"
						size="lg"
						onClick={closeLogOutModal}
					>
						닫기
					</Button>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default LogOutModal;
