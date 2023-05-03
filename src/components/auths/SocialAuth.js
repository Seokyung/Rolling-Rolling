import React from "react";
import { authService } from "api/fbase";
import {
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
	GithubAuthProvider,
} from "firebase/auth";
import "./SocialAuth.css";
import { Stack, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faGoogle,
	faGithub,
	faFacebook,
} from "@fortawesome/free-brands-svg-icons";

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
			await signInWithPopup(authService, provider);
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="login-container">
			<h3 className="login-title">간편 로그인</h3>
			<Stack className="social-form-container" gap={5}>
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
			<Form.Text
				onClick={onLoginMethodChange}
				bsPrefix="login-form-text-container"
			>
				이메일로 로그인하기
			</Form.Text>
		</div>
	);
}

export default SocialAuth;
