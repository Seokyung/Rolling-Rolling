import React from "react";
import { useLocation } from "react-router-dom";

import logoImg from "assets/Rolling-Rolling_logo.png";
import "./Logo.css";

function Logo() {
	const location = useLocation();

	const reloadHome = () => {
		let currentLocation = location.pathname;
		if (currentLocation === "/") {
			window.location.reload();
		}
	};

	return (
		<div className="logo-container">
			<img src={logoImg} onClick={reloadHome} alt="logo" />
		</div>
	);
}

export default Logo;
