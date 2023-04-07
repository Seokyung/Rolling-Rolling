import React from "react";
import logoImg from "assets/logo.png";
import { PC, TabletOrMobile } from "components/mediaQuery";
import "./Logo.css";

function Logo() {
	return (
		<>
			<PC>
				<div className="logoContainerDesktop">
					<img className="logoImgDesktop" src={logoImg} alt="logo" />
				</div>
			</PC>

			<TabletOrMobile>
				<div className="logoContainerMobile">
					<img className="logoImgMobile" src={logoImg} alt="logo" />
				</div>
			</TabletOrMobile>
		</>
	);
}

export default Logo;
