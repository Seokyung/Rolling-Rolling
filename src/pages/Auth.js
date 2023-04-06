import React from "react";
import Logo from "components/menu/Logo";
import AuthForm from "components/auths/AuthForm";
import SocialAuth from "components/auths/SocialAuth";
import { Desktop, TabletOrMobile } from "components/mediaQuery";
import "./Auth.css";

function Auth() {
	return (
		<>
			<Desktop>
				<div className="authContainerDesktop">
					<div className="authLogoLayoutDesktop">
						<Logo />
					</div>
					<div className="authLoginLayoutDesktop">
						<div className="authLoginContainerDesktop">
							<AuthForm />
							<SocialAuth />
						</div>
					</div>
				</div>
			</Desktop>

			<TabletOrMobile>
				<div className="authContainerMobile">
					<Logo />
					<div className="authLoginContainerMobile">
						<AuthForm />
						<SocialAuth />
					</div>
				</div>
			</TabletOrMobile>
		</>
	);
}

export default Auth;
