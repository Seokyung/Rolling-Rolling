import React, { useState } from "react";
import { authService } from "api/fbase";
import {
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
	GithubAuthProvider,
} from "firebase/auth";
import AuthForm from "components/authForm/AuthForm";
import { DesktopOrTablet, Mobile } from "components/mediaQuery";
import "./Auth.css";
import Logo from "components/menu/Logo";

function Auth() {
	const [socialError, setSocialError] = useState("");

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
			setSocialError(error.message);
		}
	};

	return (
		<>
			<DesktopOrTablet>
				<div className="authContainerDesktop">
					<Logo />
					<div className="authLoginContainerDesktop">
						<AuthForm />
						<div>
							<button name="google" onClick={onSocialClick}>
								Google로 로그인하기
							</button>
							<button name="facebook" onClick={onSocialClick}>
								Facebook으로 로그인하기
							</button>
							<button name="github" onClick={onSocialClick}>
								Github으로 로그인하기
							</button>
							{socialError && <span>{socialError}</span>}
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
							<button name="google" onClick={onSocialClick}>
								Google로 로그인하기
							</button>
							<button name="facebook" onClick={onSocialClick}>
								Facebook으로 로그인하기
							</button>
							<button name="github" onClick={onSocialClick}>
								Github으로 로그인하기
							</button>
							{socialError && <span>{socialError}</span>}
						</div>
					</div>
				</div>
			</Mobile>
		</>
	);
}

export default Auth;
