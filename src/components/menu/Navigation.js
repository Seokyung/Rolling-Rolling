import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { Navbar, Offcanvas, Nav, NavDropdown } from "react-bootstrap";
import logoImg from "assets/Rolling-Rolling_horizontal_logo.png";
import "./Navigation.css";

function Navigation() {
	const [isMenu, setIsMenu] = useState(false);

	const showMenu = () => {
		setIsMenu((prev) => !prev);
	};

	return (
		<>
			<div className="navigation-container">
				<Link to={"/"} className="navigation-logo-container">
					<img className="navigation-logo" src={logoImg} alt="logo" />
				</Link>
				<MenuOutlined className="navigation-menu" onClick={showMenu} />
			</div>

			<Navbar.Offcanvas placement="end" show={isMenu} onHide={showMenu}>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>Offcanvas</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<Nav className="justify-content-end flex-grow-1 pe-3">
						<Nav.Link href="/">Home</Nav.Link>
						<Nav.Link href="/profile">프로필</Nav.Link>
						<NavDropdown title="Dropdown">
							<NavDropdown.Item href="#action3">Action</NavDropdown.Item>
							<NavDropdown.Item href="#action4">
								Another action
							</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href="#action5">
								Something else here
							</NavDropdown.Item>
						</NavDropdown>
					</Nav>
				</Offcanvas.Body>
			</Navbar.Offcanvas>
		</>
	);
}

export default Navigation;
