import React, { useState } from "react";
import { authService } from "fbase";
import {
	signInWithPopup,
	GoogleAuthProvider,
	GithubAuthProvider,
} from "firebase/auth";
import AuthForm from "components/AuthForm";

function Auth() {
	const [socialError, setSocialError] = useState("");

	const onSocialClick = async (e) => {
		const {
			target: { name },
		} = e;
		let provider;
		if (name === "google") {
			provider = new GoogleAuthProvider();
		} else if (name === "github") {
			provider = new GithubAuthProvider();
		}
		try {
			await signInWithPopup(authService, provider);
		} catch (error) {
			setSocialError(error.message);
		}
	};

	return (
		<div>
			<AuthForm />
			<div>
				<button name="google" onClick={onSocialClick}>
					Google로 로그인하기
				</button>
				<button name="github" onClick={onSocialClick}>
					Github으로 로그인하기
				</button>
				{socialError && <span>{socialError}</span>}
			</div>
		</div>
	);
}

export default Auth;
