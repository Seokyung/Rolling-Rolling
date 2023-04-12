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
		<div className="social-container">
			<h3 className="social-title">간편 로그인</h3>
			<Stack className="social-form-container">
				<Button
					className="social-btn"
					variant="light"
					name="google"
					onClick={onSocialClick}
				>
					<FontAwesomeIcon icon={faGoogle} /> 구글 로그인
				</Button>
				<Button
					className="social-btn"
					variant="light"
					name="facebook"
					onClick={onSocialClick}
				>
					<FontAwesomeIcon icon={faFacebook} /> 페이스북 로그인
				</Button>
				<Button
					className="social-btn"
					variant="light"
					name="github"
					onClick={onSocialClick}
				>
					<FontAwesomeIcon icon={faGithub} /> 깃허브 로그인
				</Button>
			</Stack>
			<Form.Text
				onClick={onLoginMethodChange}
				bsPrefix="social-form-small-container"
			>
				이메일로 로그인하기
			</Form.Text>
		</div>
	);
}

export default SocialAuth;
