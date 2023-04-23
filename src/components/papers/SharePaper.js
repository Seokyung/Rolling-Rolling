import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import { Form } from "react-bootstrap";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SharePaper.css";

function SharePaper() {
	const paperId = useSelector((state) => state.paperReducer.paperId);
	const [shareModal, setShareModal] = useState(false);
	const paperUrlRef = useRef();

	const showShareModal = () => {
		setShareModal((prev) => !prev);
	};

	const onShareClick = () => {
		paperUrlRef.current.focus();
		paperUrlRef.current.select();
		navigator.clipboard.writeText(paperUrlRef.current.value).then(() => {
			alert("링크를 복사했습니다!");
		});
	};

	return (
		<div className="sharePaper-container">
			<button className="sharePaper-btn" onClick={showShareModal}>
				<FontAwesomeIcon icon={faShareNodes} />내 페이퍼 공유하기
			</button>
			{shareModal && (
				<div className="sharePaper-link">
					<Form.Control
						type="text"
						readOnly
						ref={paperUrlRef}
						value={`http://localhost:3000/paper/${paperId}`}
					/>
					<button onClick={onShareClick}>링크 복사</button>
				</div>
			)}
		</div>
	);
}

export default SharePaper;
