import React from "react";

import { Offcanvas } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import "./PaperSettings.css";

function PaperSettings({
	paperSettings,
	setPaperSettings,
	setEditModal,
	setDeleteModal,
}) {
	const showPaperSettings = () => {
		setPaperSettings((prev) => !prev);
	};

	const openEditModal = () => {
		setPaperSettings(false);
		setEditModal(true);
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
			<Offcanvas.Header closeButton>
				<Offcanvas.Title className="paperSettings-offcanvas-title">
					<FontAwesomeIcon icon={faGear} />
					페이퍼 설정
				</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body className="paperSettings-offcanvas-body">
				<button className="paperSettings-edit-btn" onClick={openEditModal}>
					<FontAwesomeIcon icon={faPenToSquare} />
					페이퍼 수정
				</button>
				<button className="paperSettings-delete-btn" onClick={openDeleteModal}>
					<FontAwesomeIcon icon={faTrash} />
					페이퍼 삭제
				</button>
			</Offcanvas.Body>
		</Offcanvas>
	);
}

export default PaperSettings;
