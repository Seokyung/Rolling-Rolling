import React, { useState } from "react";
import { authService } from "api/fbase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import logoImg from "assets/Rolling-Rolling_logo.png";
import { Navbar, Offcanvas, Nav, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Navigation.css";

function Navigation() {
	const userName = useSelector((state) => state.userReducer.displayName);
	const [isMenu, setIsMenu] = useState(false);
	const navigate = useNavigate();

	const showMenu = () => {
		setIsMenu((prev) => !prev);
	};

	const closeMenu = () => {
		setIsMenu(false);
	};

	const onLogoutClick = async () => {
		const isLogout = window.confirm("로그아웃 하시겠습니까?");
		if (isLogout) {
			try {
				await signOut(authService);
				alert("로그아웃 되었습니다!");
				navigate("/", { replace: true });
			} catch (error) {
				alert(error.message);
			}
		}
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

			<Navbar.Offcanvas
				className="navigation-offcanvas-container"
				placement="end"
				show={isMenu}
				onHide={closeMenu}
			>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title className="navigation-offcanvas-title">
						<span className="navigation-offcanvas-username">{userName}</span>님
					</Offcanvas.Title>
				</Offcanvas.Header>
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
							<FontAwesomeIcon icon={faUser} />내 정보
						</Link>
					</Nav>
					<Button
						className="navigation-offcanvas-logout-btn"
						onClick={onLogoutClick}
					>
						로그아웃
					</Button>
				</Offcanvas.Body>
			</Navbar.Offcanvas>
		</>
	);
}

export default Navigation;
