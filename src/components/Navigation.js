import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";
import { useSelector } from "react-redux";

function Navigation() {
	const userName = useSelector((state) => state.userReducer.displayName);

	return (
		<nav>
			<ul className="navUl">
				<li>
					<Link to={"/"} className="navMenu">
						<span className="navMenuName">Home</span>
					</Link>
				</li>
				<li>
					<Link to={"/profile"} className="navMenu">
						<span className="navMenuName">{userName}의 Profile</span>
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Navigation;
