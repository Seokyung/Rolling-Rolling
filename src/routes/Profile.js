import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { authService } from "fbase";

function Profile() {
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
			<h2>Profile</h2>
			<button onClick={onLogoutClick}>로그아웃</button>
		</div>
	);
}

export default Profile;
