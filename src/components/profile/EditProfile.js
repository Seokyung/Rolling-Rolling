import React, { useState } from "react";
import { authService } from "fbase";
import { updateProfile } from "firebase/auth";

function EditProfile({ userObj, refreshUser }) {
	const [userName, setUserName] = useState(userObj.displayName);

	const onUserNameChange = (e) => {
		const {
			target: { value },
		} = e;
		setUserName(value);
	};

	const onUpdateProfile = async (e) => {
		e.preventDefault();
		if (userName === "") {
			alert("이름을 작성해주세요!");
			return;
		}
		if (userName !== userObj.displayName) {
			const isEdit = window.confirm("프로필을 변경하시겠습니까?");
			if (isEdit) {
				await updateProfile(authService.currentUser, {
					displayName: userName,
				});
				alert("프로필이 변경되었습니다!");
				refreshUser();
			}
		}
	};

	return (
		<div>
			<h2>Edit Profile</h2>
			<form onSubmit={onUpdateProfile}>
				<input
					type="text"
					value={userName}
					onChange={onUserNameChange}
					placeholder={userObj.displayName}
				/>
				<input type="submit" value="프로필 변경" />
			</form>
		</div>
	);
}

export default EditProfile;
