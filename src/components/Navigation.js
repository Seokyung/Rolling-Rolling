import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

function Navigation({ userObj }) {
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
						<span className="navMenuName">{userObj.displayName}의 Profile</span>
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Navigation;
