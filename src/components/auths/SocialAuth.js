import React from "react";
import { authService } from "api/fbase";
import {
	setPersistence,
	inMemoryPersistence,
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
	GithubAuthProvider,
} from "firebase/auth";

import { Stack, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faGoogle,
	faGithub,
	faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import "./SocialAuth.css";

function SocialAuth({ onLoginMethodChange }) {
	const onSocialClick = async (e) => {
		const {
			target: { name },
		} = e;
		let provider;
		if (name === "google") {
			provider = new GoogleAuthProvider();
		} else if (name === "facebook") {
			provider = new FacebookAuthProvider();
		} else if (name === "github") {
			provider = new GithubAuthProvider();
		}
		try {
			// setPersistence(authService, inMemoryPersistence).then(() => {
			// 	return signInWithPopup(authService, provider);
			// });
			await signInWithPopup(authService, provider);
		} catch (error) {
			console.log(error.code);
		}
	};

	return (
		<>
			<h3 className="login-title">간편 로그인</h3>
			<Stack className="social-form-container" gap={4}>
				<Button
					className="social-btn google"
					name="google"
					onClick={onSocialClick}
				>
					<FontAwesomeIcon icon={faGoogle} className="icon-margin-right" />
					구글 로그인
				</Button>
				<Button
					className="social-btn facebook"
					name="facebook"
					onClick={onSocialClick}
				>
					<FontAwesomeIcon icon={faFacebook} className="icon-margin-right" />
					페이스북 로그인
				</Button>
				<Button
					className="social-btn github"
					name="github"
					onClick={onSocialClick}
				>
					<FontAwesomeIcon icon={faGithub} className="icon-margin-right" />
					깃허브 로그인
				</Button>
			</Stack>
			<span className="social-text" onClick={onLoginMethodChange}>
				이메일로 로그인하기
			</span>
		</>
	);
}

export default SocialAuth;
