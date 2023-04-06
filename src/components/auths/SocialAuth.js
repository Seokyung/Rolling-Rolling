import React from "react";
import { authService } from "api/fbase";
import {
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
	GithubAuthProvider,
} from "firebase/auth";
import "./SocialAuth.css";

import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faGoogle,
	faGithub,
	faFacebook,
} from "@fortawesome/free-brands-svg-icons";

function SocialAuth() {
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
		<div className="authSocialContainerDesktop">
			<Button className="socialBtn" name="google" onClick={onSocialClick}>
				<FontAwesomeIcon icon={faGoogle} /> 구글 로그인
			</Button>
			<Button className="socialBtn" name="facebook" onClick={onSocialClick}>
				<FontAwesomeIcon icon={faFacebook} /> 페이스북 로그인
			</Button>
			<Button className="socialBtn" name="github" onClick={onSocialClick}>
				<FontAwesomeIcon icon={faGithub} /> 깃허브 로그인
			</Button>
		</div>
	);
}

export default SocialAuth;
