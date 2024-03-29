import React, { useState } from "react";
import Logo from "components/auths/Logo";
import AuthForm from "components/auths/AuthForm";
import SocialAuth from "components/auths/SocialAuth";

import "./Auth.css";

function Auth() {
	const [isSocial, setIsSocial] = useState(true);

	const onLoginMethodChange = () => {
		setIsSocial((prev) => !prev);
	};

	return (
		<div className="auth-container">
			<div className="auth-logo-container">
				<Logo />
			</div>
			<div className="auth-gap"></div>
			<div className="auth-login-container">
				<div className="login-container">
					{isSocial ? (
						<SocialAuth onLoginMethodChange={onLoginMethodChange} />
					) : (
						<AuthForm onLoginMethodChange={onLoginMethodChange} />
					)}
				</div>
			</div>
		</div>
	);
}

export default Auth;
