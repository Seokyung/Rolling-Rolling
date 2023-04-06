import React, { useState } from "react";
import { authService } from "api/fbase";
import {
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
	GithubAuthProvider,
} from "firebase/auth";
import Logo from "components/menu/Logo";
import AuthForm from "components/authForm/AuthForm";
import { DesktopOrTablet, Mobile } from "components/mediaQuery";
import "./Auth.css";

import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faGoogle,
	faGithub,
	faFacebook,
} from "@fortawesome/free-brands-svg-icons";

function Auth() {
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
			<DesktopOrTablet>
				<div className="authContainerDesktop">
					<Logo />
					<div className="authLoginContainerDesktop">
						<AuthForm />
						<div className="authSocialContainerDesktop">
							<Button
								shape="circle"
								size="large"
								className="socialBtn"
								name="google"
								onClick={onSocialClick}
							>
								<FontAwesomeIcon icon={faGoogle} />
							</Button>
							<Button
								shape="circle"
								size="large"
								className="socialBtn"
								name="facebook"
								onClick={onSocialClick}
							>
								<FontAwesomeIcon icon={faFacebook} />
							</Button>
							<Button
								shape="circle"
								size="large"
								className="socialBtn"
								name="github"
								onClick={onSocialClick}
							>
								<FontAwesomeIcon icon={faGithub} />
							</Button>
						</div>
					</div>
				</div>
			</DesktopOrTablet>

			<Mobile>
				<div className="authContainerMobile">
					<Logo />
					<div className="authLoginContainerMobile">
						<AuthForm />
						<div>
							<Button variant="light" name="google" onClick={onSocialClick}>
								Google로 로그인하기
							</Button>
							<Button variant="light" name="facebook" onClick={onSocialClick}>
								Facebook으로 로그인하기
							</Button>
							<Button variant="light" name="github" onClick={onSocialClick}>
								Github으로 로그인하기
							</Button>
						</div>
					</div>
				</div>
			</Mobile>
		</>
	);
}

export default Auth;
