import React, { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { useSelector } from "react-redux";
import EditUser from "./EditUser";

import { Form, Button, InputGroup } from "react-bootstrap";
import { Divider, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUserPen,
	faPenToSquare,
	faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./EditProfile.css";

function EditProfile({ refreshUser, openLogOutModal, openDeleteModal }) {
	const userObj = useSelector((state) => state.userReducer);

	const [userName, setUserName] = useState(userObj.displayName);
	const [profileImg, setProfileImg] = useState(userObj.photoURL);
	const userNameRef = useRef(null);

	const [currentNameLength, setCurrentNameLength] = useState(userName.length);
	const maxNameLength = 20;

	const [validated, setValidated] = useState(false);
	const [isNameValidate, setIsNameValidate] = useState(true);
	const [isImgValidate, setIsImgValidate] = useState(true);

	const [editModal, setEditModal] = useState(false);
	const [editType, setEditType] = useState("");

	const [messageApi, contextHolder] = message.useMessage();

	const onUserNameChange = (e) => {
		const {
			target: { value },
		} = e;
		if (value.length <= maxNameLength) {
			setUserName(value);
			setCurrentNameLength(value.length);
		}
		if (value === userObj.displayName) {
			setIsNameValidate(true);
		} else {
			setIsNameValidate(false);
		}
	};

	const onProfileImgChange = async (e) => {
		const {
			target: { files },
		} = e;
		const imgFile = files[0];
		try {
			const compressedImg = await imageCompression(imgFile, { maxSizeMB: 0.1 });
			const promise = imageCompression.getDataUrlFromFile(compressedImg);
			promise.then((result) => {
				setProfileImg(result);
			});
			setIsImgValidate(false);
		} catch (error) {
			console.log(error.code);
		}
	};

	const undoChanges = () => {
		setUserName(userObj.displayName);
		setProfileImg(userObj.photoURL);

		setIsNameValidate(true);
		setIsImgValidate(true);
	};

	const openEditModal = (info) => {
		setEditType(info);
		setEditModal(true);
	};

	const onUpdateUserName = async (e) => {
		e.preventDefault();
		if (userName === "") {
			userNameRef.current.focus();
			setValidated(true);
			return;
		}
		if (userName !== userObj.displayName) {
			openEditModal("userName");
		}
	};

	const onUpdateProfileImg = async (e) => {
		e.preventDefault();
		if (profileImg === "") {
			return;
		}
		openEditModal("profileImg");
	};

	return (
		<>
			{contextHolder}
			<Form
				noValidate
				validated={validated}
				className="editPaper-form-container"
			>
				<div className="editProfile-header-container">
					<h2 className="editProfile-title">
						<FontAwesomeIcon icon={faUserPen} /> 프로필 수정
					</h2>
				</div>
				<Divider className="offcanvas-divider" />
				<Form.Group className="editProfile-form-group">
					<div className="editProfile-input-group editProfile-profile-img-container">
						<div className="profile-img-upload-wrapper">
							<div className="profile-img-upload-container">
								<img src={profileImg} alt="editProfileImage" />
								<label htmlFor="profileImgInput">
									<div>
										<p>
											<FontAwesomeIcon icon={faPenToSquare} /> 사진 선택
										</p>
									</div>
								</label>
							</div>
						</div>
						<Form.Control
							type="file"
							id="profileImgInput"
							onChange={onProfileImgChange}
							accept="image/*"
						/>
						<Button disabled={isImgValidate} onClick={onUpdateProfileImg}>
							프로필 사진 변경
						</Button>
					</div>
				</Form.Group>
				<Divider className="offcanvas-divider" />
				<Form.Group className="editProfile-form-group">
					<Form.Label className="create-form-title">이름 변경하기</Form.Label>
					<InputGroup hasValidation className="editProfile-input-group">
						<Form.Control
							type="text"
							className="create-form-input"
							required
							value={userName}
							ref={userNameRef}
							maxLength={maxNameLength}
							onChange={onUserNameChange}
							placeholder={userObj.displayName}
						/>
						<Button disabled={isNameValidate} onClick={onUpdateUserName}>
							이름 변경
						</Button>
						<Form.Control.Feedback
							className="create-form-feedback"
							type="invalid"
						>
							이름을 입력해주세요!
						</Form.Control.Feedback>
					</InputGroup>
					<Form.Text className="create-form-length-text">
						{currentNameLength} / {maxNameLength}
					</Form.Text>
				</Form.Group>
				<Divider className="offcanvas-divider" />
				<Form.Group className="editProfile-undo-btn">
					<Button
						variant="secondary"
						disabled={!(!isNameValidate || !isImgValidate)}
						onClick={undoChanges}
					>
						<FontAwesomeIcon icon={faClockRotateLeft} /> 변경사항 되돌리기
					</Button>
				</Form.Group>
				<Divider className="offcanvas-divider" />
				<Form.Group className="editProfile-auth-btn">
					<Button
						id="logout-btn"
						variant="outline-secondary"
						onClick={openLogOutModal}
					>
						로그아웃
					</Button>
					<Button
						id="withdraw-btn"
						variant="outline-danger"
						onClick={openDeleteModal}
					>
						회원 탈퇴
					</Button>
				</Form.Group>
			</Form>

			<EditUser
				editModal={editModal}
				setEditModal={setEditModal}
				editType={editType}
				userName={userName}
				profileImg={profileImg}
				setIsNameValidate={setIsNameValidate}
				setIsImgValidate={setIsImgValidate}
				messageApi={messageApi}
				refreshUser={refreshUser}
			/>
		</>
	);
}

export default EditProfile;
