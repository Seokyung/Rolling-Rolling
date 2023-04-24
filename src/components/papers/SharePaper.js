import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import { Form, Collapse, InputGroup } from "react-bootstrap";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SharePaper.css";

function SharePaper() {
	const paperId = useSelector((state) => state.paperReducer.paperId);
	const [isShare, setIsShare] = useState(false);
	const paperUrlRef = useRef();

	const showShareLink = () => {
		setIsShare((prev) => !prev);
		const svg = document.querySelector(".sharePaper-btn svg");
		if (!isShare) {
			svg.classList.add("rotate-animation");
		} else {
			svg.classList.remove("rotate-animation");
		}
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
			<button className="sharePaper-btn" onClick={showShareLink}>
				<FontAwesomeIcon icon={faShareNodes} />내 페이퍼 공유하기
			</button>
			{/* <input
				type="checkbox"
				id="sharePaper-checkbox"
				checked={shareModal}
				onChange={showShareModal}
			/>
			<label className="sharePaper-btn" htmlFor="sharePaper-checkbox">
				<FontAwesomeIcon icon={faShareNodes} />내 페이퍼 공유하기
			</label> */}
			<Collapse in={isShare}>
				<div className="sharePaper-link">
					<InputGroup>
						<Form.Control
							type="text"
							readOnly
							ref={paperUrlRef}
							value={`http://localhost:3000/paper/${paperId}`}
						/>
						<button onClick={onShareClick}>링크 복사</button>
					</InputGroup>
				</div>
			</Collapse>
		</div>
	);
}

export default SharePaper;
