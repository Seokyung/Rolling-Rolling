import React, { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { authService, storageService } from "api/fbase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useSelector } from "react-redux";

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
			console.log(error);
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
			<h2>Edit Profile</h2>
			<form onSubmit={onUpdateUserName}>
				<input
					type="text"
					value={userName}
					onChange={onUserNameChange}
					placeholder={userObj.displayName}
				/>
				<input type="submit" value="이름 변경" />
			</form>
			<form onSubmit={onUpdateProfileImg}>
				<label>
					<span>이미지 첨부</span>
					<input
						type="file"
						id="profileImgInput"
						ref={profileImgRef}
						onChange={onProfileImgChange}
						accept="image/*"
						style={{ display: "none" }}
					/>
				</label>
				<img src={profileImg} width="100px" alt="editProfileImage" />
				<input type="submit" value="프로필 사진 변경" />
			</form>
		</div>
	);
}

export default EditProfile;
