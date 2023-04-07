import React, { useState } from "react";
import Logo from "components/menu/Logo";
import AuthForm from "components/auths/AuthForm";
import SocialAuth from "components/auths/SocialAuth";
import { PC, TabletOrMobile } from "components/mediaQuery";
import "./Auth.css";

function Auth() {
	const [isSocial, setIsSocial] = useState(true);

	const onLoginMethodChange = () => {
		setIsSocial((prev) => !prev);
	};

	return (
		<>
			<PC>
				<div className="authContainerDesktop">
					<div className="authLogoContainerDesktop">
						<Logo />
					</div>
					<div className="authLoginContainerDesktop">
						{isSocial ? (
							<SocialAuth onLoginMethodChange={onLoginMethodChange} />
						) : (
							<AuthForm onLoginMethodChange={onLoginMethodChange} />
						)}
					</div>
				</div>
			</PC>

			<TabletOrMobile>
				<div className="authContainerMobile">
					<div className="authLogoContainerMobile">
						<Logo />
					</div>
					<div className="authLoginContainerMobile">
						{isSocial ? (
							<SocialAuth onLoginMethodChange={onLoginMethodChange} />
						) : (
							<AuthForm onLoginMethodChange={onLoginMethodChange} />
						)}
					</div>
				</div>
			</TabletOrMobile>
		</>
	);
}

export default Auth;
