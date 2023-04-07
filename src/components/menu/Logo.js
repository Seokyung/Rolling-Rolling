import React from "react";
import logoImg from "assets/logo.png";
import "./Logo.css";

function Logo() {
	return (
		<div className="logoContainer">
			<img className="logoImg" src={logoImg} alt="logo" />
		</div>
		// <>
		// 	<PC>
		// 		<div className="logoContainerDesktop">
		// 			<img className="logoImgDesktop" src={logoImg} alt="logo" />
		// 		</div>
		// 	</PC>

		// 	<TabletOrMobile>
		// 		<div className="logoContainerMobile">
		// 			<img className="logoImgMobile" src={logoImg} alt="logo" />
		// 		</div>
		// 	</TabletOrMobile>
		// </>
	);
}

export default Logo;
