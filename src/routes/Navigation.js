import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LogOutModal from "components/user/LogOutModal";

import logoImg from "assets/Rolling-Rolling_logo.png";
import { Navbar, Offcanvas, Nav, Button } from "react-bootstrap";
import { Divider } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Navigation.css";

function Navigation() {
	const userName = useSelector((state) => state.userReducer.displayName);
	const [isMenu, setIsMenu] = useState(false);
	const [logOutModal, setLogOutModal] = useState(false);

	const location = useLocation();

	const reloadHome = () => {
		let currentLocation = location.pathname;
		if (currentLocation === "/") {
			window.location.reload();
		}
	};

	const showMenu = () => {
		setIsMenu((prev) => !prev);
	};

	const closeMenu = () => {
		setIsMenu(false);
	};

	const openLogOutModal = () => {
		setLogOutModal(true);
	};

	return (
		<>
			<div className="navigation-wrapper">
				<div className="navigation-container">
					<Link
						to={"/"}
						onClick={reloadHome}
						className="navigation-logo-container"
					>
						<img className="navigation-logo" src={logoImg} alt="logo" />
					</Link>
					<button className="navigation-menu" onClick={showMenu}>
						<FontAwesomeIcon icon={faBars} />
					</button>
				</div>
			</div>

			<Navbar.Offcanvas
				className="navigation-offcanvas-container"
				placement="end"
				show={isMenu}
				onHide={closeMenu}
			>
				<Offcanvas.Header closeButton className="navigation-offcanvas-header">
					<Offcanvas.Title className="navigation-offcanvas-title">
						<span>{userName}</span>님
					</Offcanvas.Title>
				</Offcanvas.Header>
				<Divider className="divider-margin" />
				<Offcanvas.Body className="navigation-offcanvas-body">
					<Nav className="navigation-offcanvas-nav">
						<Link
							to={"/"}
							className="navigation-offcanvas-nav-link"
							onClick={closeMenu}
						>
							<FontAwesomeIcon icon={faHouse} />
							페이퍼 홈
						</Link>
						<Link
							to={"/profile"}
							className="navigation-offcanvas-nav-link"
							onClick={closeMenu}
						>
							<FontAwesomeIcon icon={faUser} />내 프로필
						</Link>
					</Nav>
					<Divider className="divider-margin" />
					<div className="navigation-offcanvas-logout-btn">
						<Button onClick={openLogOutModal}>로그아웃</Button>
					</div>
				</Offcanvas.Body>
			</Navbar.Offcanvas>

			<LogOutModal logOutModal={logOutModal} setLogOutModal={setLogOutModal} />
		</>
	);
}

export default Navigation;
