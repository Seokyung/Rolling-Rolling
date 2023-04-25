import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Offcanvas } from "react-bootstrap";
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
			<Offcanvas.Body className="paperSettings-offcanvas-body">
				<button id="edit-btn" onClick={gotoEditPaper}>
					<FontAwesomeIcon icon={faPenToSquare} />
					페이퍼 수정
				</button>
				<button id="delete-btn" onClick={openDeleteModal}>
					<FontAwesomeIcon icon={faTrash} />
					페이퍼 삭제
				</button>
			</Offcanvas.Body>
		</Offcanvas>
	);
}

export default PaperSettings;
