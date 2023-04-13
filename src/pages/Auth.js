import React, { useState } from "react";
import AuthLogo from "components/auths/AuthLogo";
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
				<AuthLogo />
			</div>
			<div className="auth-login-container">
				{isSocial ? (
					<SocialAuth onLoginMethodChange={onLoginMethodChange} />
				) : (
					<AuthForm onLoginMethodChange={onLoginMethodChange} />
				)}
			</div>
		</div>
	);
}

export default Auth;
