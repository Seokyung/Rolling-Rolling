import React, { useState } from "react";
import { authService } from "api/fbase";
import {
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
	GithubAuthProvider,
} from "firebase/auth";
import AuthForm from "components/AuthForm";
import { Desktop, Tablet, Mobile } from "components/mediaQuery";
import "./Auth.css";

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
			<Desktop>
				<div className="authContainerPC">
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
			</Desktop>

			<Tablet>
				<div className="authContainerTablet">
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
			</Tablet>

			<Mobile>
				<div className="authContainerMobile">
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
			</Mobile>
		</>
	);
}

export default Auth;
