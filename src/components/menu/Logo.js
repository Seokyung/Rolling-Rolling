import React from "react";
import logoImg from "assets/logo.png";
import "./Logo.css";

function Logo() {
	return (
		<div className="logoContainer">
			<img className="logoImg" src={logoImg} alt="logo" />
		</div>
	);
}

export default Logo;
