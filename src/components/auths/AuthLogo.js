import React from "react";
import { useLocation } from "react-router-dom";

import logoImg from "assets/Rolling-Rolling_logo.png";
import "./AuthLogo.css";

function AuthLogo() {
	const location = useLocation();

	const reloadHome = () => {
		let currentLocation = location.pathname;
		if (currentLocation === "/") {
			window.location.reload();
		}
	};

	return (
		<div className="auth-logo-container">
			<div className="logo-container">
				<img src={logoImg} onClick={reloadHome} alt="logo" />
			</div>
		</div>
	);
}

export default AuthLogo;
