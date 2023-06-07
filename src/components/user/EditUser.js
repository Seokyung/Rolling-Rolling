import React from "react";
import { authService, storageService } from "api/fbase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useSelector } from "react-redux";

import { Modal, Button, CloseButton } from "react-bootstrap";

function EditUser({
	editModal,
	setEditModal,
	editType,
	userName,
	profileImg,
	setIsNameValidate,
	setIsImgValidate,
	messageApi,
	refreshUser,
}) {
	const userObj = useSelector((state) => state.userReducer);

	const key = "updatable";

	const closeEditModal = () => {
		setEditModal(false);
	};

	const onUpdateUserInfo = async (e) => {
		await messageApi.open({
			key,
			type: "loading",
			content: "수정중...",
			className: "alert-message-container",
		});

		try {
			if (editType === "userName") {
				await updateProfile(authService.currentUser, {
					displayName: userName,
				});
				setIsNameValidate(true);
			} else if (editType === "profileImg") {
				const imgRef = ref(storageService, `${userObj.uid}/profileImg`);
				await uploadString(imgRef, profileImg, "data_url");
				const profileImgUrl = await getDownloadURL(imgRef);
				await updateProfile(authService.currentUser, {
					photoURL: profileImgUrl,
				});
				setIsImgValidate(true);
			}
			closeEditModal();
			messageApi.open({
				key,
				type: "success",
				content: "수정되었습니다!",
				className: "alert-message-container",
				duration: 2,
			});
		} catch (error) {
			messageApi.open({
				key,
				type: "error",
				content: "수정에 실패하였습니다 😢",
				className: "alert-message-container",
				duration: 2,
			});
			if (editType === "userName") {
				setIsNameValidate(false);
			} else if (editType === "profileImg") {
				setIsImgValidate(false);
			}
			console.log(error.code);
		} finally {
			refreshUser();
		}
	};

	return (
		<Modal
			show={editModal}
			onHide={closeEditModal}
			onExit={closeEditModal}
			centered
			animation={true}
		>
			<Modal.Header className="delete-modal-header">
				<Modal.Title className="delete-modal-title">
					프로필 정보를 수정하시겠습니까?
				</Modal.Title>
				<CloseButton className="modal-close-btn" onClick={closeEditModal} />
			</Modal.Header>
			<Modal.Body className="delete-modal-body">
				<Button id="delete-btn" size="lg" onClick={onUpdateUserInfo}>
					수정하기
				</Button>
				<Button
					id="close-btn"
					variant="outline-secondary"
					size="lg"
					onClick={closeEditModal}
				>
					닫기
				</Button>
			</Modal.Body>
		</Modal>
	);
}

export default EditUser;
