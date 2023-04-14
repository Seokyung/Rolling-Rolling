import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import logoImg from "assets/Rolling-Rolling_logo.png";
import { Navbar, Offcanvas, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Navigation.css";

function Navigation() {
	const userName = useSelector((state) => state.userReducer.displayName);
	const [isMenu, setIsMenu] = useState(false);

	const showMenu = () => {
		setIsMenu((prev) => !prev);
	};

	const closeMenu = () => {
		setIsMenu(false);
	};

	return (
		<>
			<div className="navigation-container">
				<Link to={"/"} className="navigation-logo-container">
					<img className="navigation-logo" src={logoImg} alt="logo" />
				</Link>
				<button className="navigation-menu" onClick={showMenu}>
					<FontAwesomeIcon icon={faBars} />
				</button>
			</div>

			<Navbar.Offcanvas placement="end" show={isMenu} onHide={showMenu}>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>
						<span className="navigation-offcanvas-username">{userName}</span>님
					</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<Nav className="navigation-offcanvas-body">
						<Link
							to={"/"}
							className="navigation-offcanvas-body-link"
							onClick={closeMenu}
						>
							<FontAwesomeIcon icon={faHouse} />
							페이퍼 홈
						</Link>
						<Link
							to={"/profile"}
							className="navigation-offcanvas-body-link"
							onClick={closeMenu}
						>
							<FontAwesomeIcon icon={faUser} />내 정보
						</Link>
					</Nav>
				</Offcanvas.Body>
			</Navbar.Offcanvas>
		</>
	);
}

export default Navigation;
