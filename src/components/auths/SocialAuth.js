import React from "react";
import { authService } from "api/fbase";
import {
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
	GithubAuthProvider,
} from "firebase/auth";
import "./SocialAuth.css";
import { Desktop, TabletOrMobile } from "components/mediaQuery";
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
		<>
			<Desktop>
				<div className="socialContainerDesktop">
					<h3 className="socialTitle">간편 로그인</h3>
					<Stack className="socialFormContainerDesktop">
						<Button
							className="socialBtn"
							variant="light"
							name="google"
							onClick={onSocialClick}
						>
							<FontAwesomeIcon icon={faGoogle} /> 구글 로그인
						</Button>
						<Button
							className="socialBtn"
							variant="light"
							name="facebook"
							onClick={onSocialClick}
						>
							<FontAwesomeIcon icon={faFacebook} /> 페이스북 로그인
						</Button>
						<Button
							className="socialBtn"
							variant="light"
							name="github"
							onClick={onSocialClick}
						>
							<FontAwesomeIcon icon={faGithub} /> 깃허브 로그인
						</Button>
					</Stack>
					<Form.Text className="socialFormText" onClick={onLoginMethodChange}>
						이메일로 로그인
					</Form.Text>
				</div>
			</Desktop>

			<TabletOrMobile>
				<div className="socialContainerMobile">
					<h3 className="socialTitle">간편 로그인</h3>
					<Stack className="socialFormContainerDesktop">
						<Button
							className="socialBtn"
							variant="light"
							name="google"
							onClick={onSocialClick}
						>
							<FontAwesomeIcon icon={faGoogle} /> 구글 로그인
						</Button>
						<Button
							className="socialBtn"
							variant="light"
							name="facebook"
							onClick={onSocialClick}
						>
							<FontAwesomeIcon icon={faFacebook} /> 페이스북 로그인
						</Button>
						<Button
							className="socialBtn"
							variant="light"
							name="github"
							onClick={onSocialClick}
						>
							<FontAwesomeIcon icon={faGithub} /> 깃허브 로그인
						</Button>
					</Stack>
					<Form.Text className="socialFormText" onClick={onLoginMethodChange}>
						이메일로 로그인
					</Form.Text>
				</div>
			</TabletOrMobile>
		</>
	);
}

export default SocialAuth;
