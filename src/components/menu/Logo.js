import React from "react";
import logoImg from "assets/logo.png";
import { Desktop, TabletOrMobile } from "components/mediaQuery";
import "./Logo.css";

function Logo() {
	return (
		<>
			<Desktop>
				<div className="logoContainerDesktop">
					<img className="logoImgDesktop" src={logoImg} alt="logo" />
				</div>
			</Desktop>

			<TabletOrMobile>
				<div className="logoContainerMobile">
					<img className="logoImgMobile" src={logoImg} alt="logo" />
				</div>
			</TabletOrMobile>
		</>
	);
}

export default Logo;
