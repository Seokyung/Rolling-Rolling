import React from "react";
import logoImg from "assets/Rolling-Rolling_logo.png";
import "./AuthLogo.css";

function AuthLogo() {
	return (
		<div className="logoContainer">
			<img className="logoImg" src={logoImg} alt="logo" />
		</div>
	);
}

export default AuthLogo;
