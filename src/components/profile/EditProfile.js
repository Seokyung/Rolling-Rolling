import React, { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { authService, storageService } from "api/fbase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useSelector } from "react-redux";

import { Form, Button } from "react-bootstrap";
import { Divider } from "antd";

function EditProfile({ refreshUser }) {
	const userObj = useSelector((state) => state.userReducer);
	const profileImgRef = useRef(null);
	const [userName, setUserName] = useState(userObj.displayName);
	const [profileImg, setProfileImg] = useState(userObj.photoURL);
	const [isImgChanged, setIsImgChanged] = useState(false);

	const onUserNameChange = (e) => {
		const {
			target: { value },
		} = e;
		setUserName(value);
	};

	const onProfileImgChange = async (e) => {
		const {
			target: { files },
		} = e;
		const imgFile = files[0];
		try {
			const compressedImg = await imageCompression(imgFile, { maxSizeMB: 0.5 });
			const promise = imageCompression.getDataUrlFromFile(compressedImg);
			promise.then((result) => {
				setProfileImg(result);
			});
			setIsImgChanged(true);
		} catch (error) {
			console.log(error.code);
		}
	};

	const onUpdateUserName = async (e) => {
		e.preventDefault();
		if (userName === "") {
			alert("이름을 작성해주세요!");
			return;
		}
		if (userName !== userObj.displayName) {
			const isEdit = window.confirm("이름을 변경하시겠습니까?");
			if (isEdit) {
				await updateProfile(authService.currentUser, {
					displayName: userName,
				});
				alert("이름이 변경되었습니다!");
				refreshUser();
			}
		}
	};

	const onUpdateProfileImg = async (e) => {
		e.preventDefault();
		if (profileImg === "") {
			alert("사진을 선택해주세요!");
			return;
		}
		if (isImgChanged) {
			const isEdit = window.confirm("프로필 사진을 변경하시겠습니까?");
			if (isEdit) {
				const imgRef = ref(storageService, `${userObj.uid}/profileImg`);
				await uploadString(imgRef, profileImg, "data_url");
				const profileImgUrl = await getDownloadURL(imgRef);
				await updateProfile(authService.currentUser, {
					photoURL: profileImgUrl,
				});
				alert("프로필 사진이 변경되었습니다!");
				refreshUser();
			}
		}
	};

	return (
		<div>
			<Form className="editPaper-form-container">
				<Form.Group className="create-form-group">
					<Form.Label className="create-form-title">이름 변경하기</Form.Label>
					<Form.Control
						type="text"
						className="create-form-input"
						value={userName}
						onChange={onUserNameChange}
						placeholder={userObj.displayName}
					/>
					<Button onClick={onUpdateUserName}>이름 변경</Button>
				</Form.Group>
				<Divider className="offcanvas-divider" />
				<Form.Group className="create-form-group">
					<Form.Label className="create-form-title">
						프로필 사진 변경하기
					</Form.Label>
					<img src={profileImg} width="100px" alt="editProfileImage" />
					<Form.Control
						type="file"
						id="profileImgInput"
						ref={profileImgRef}
						onChange={onProfileImgChange}
						accept="image/*"
					/>
					<Button onClick={onUpdateProfileImg}>프로필 사진 변경</Button>
				</Form.Group>
			</Form>
		</div>
	);
}

export default EditProfile;
