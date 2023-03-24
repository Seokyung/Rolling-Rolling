import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { authService } from "fbase";
import EditProfile from "components/profile/EditProfile";

function Profile({ userObj, refreshUser }) {
	const navigate = useNavigate();

	const onLogoutClick = async () => {
		try {
			await signOut(authService);
			navigate("/", { replace: true });
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<div>
			<img src={`${userObj.photoURL}`} width="100px" />
			<h2>{userObj.displayName}</h2>
			<EditProfile userObj={userObj} refreshUser={refreshUser} />
			<button onClick={onLogoutClick}>로그아웃</button>
		</div>
	);
}

export default Profile;
