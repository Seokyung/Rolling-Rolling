import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Offcanvas, Button } from "react-bootstrap";
import { Divider } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import "./PaperSettings.css";

function PaperSettings({ paperSettings, setPaperSettings, setDeleteModal }) {
	const paperId = useSelector((state) => state.paperReducer.paperId);
	const navigate = useNavigate();

	const showPaperSettings = () => {
		setPaperSettings((prev) => !prev);
	};

	const gotoEditPaper = () => {
		navigate(`/paper/edit/${paperId}`);
	};

	const openDeleteModal = () => {
		setPaperSettings(false);
		setDeleteModal(true);
	};

	return (
		<Offcanvas
			className="paperSettings-offcanvas-container"
			show={paperSettings}
			onHide={showPaperSettings}
			placement="bottom"
		>
			<Offcanvas.Header className="paperSettings-offcanvas-header" closeButton>
				<Offcanvas.Title className="paperSettings-offcanvas-title">
					<FontAwesomeIcon icon={faGear} />
					페이퍼 설정
				</Offcanvas.Title>
			</Offcanvas.Header>
			<Divider className="offcanvas-divider" />
			<Offcanvas.Body className="paperSettings-offcanvas-body">
				<Button id="edit-btn" onClick={gotoEditPaper}>
					<FontAwesomeIcon icon={faPenToSquare} />
					페이퍼 수정
				</Button>
				<Button
					id="delete-btn"
					variant="outline-danger"
					onClick={openDeleteModal}
				>
					<FontAwesomeIcon icon={faTrash} />
					페이퍼 삭제
				</Button>
			</Offcanvas.Body>
		</Offcanvas>
	);
}

export default PaperSettings;
