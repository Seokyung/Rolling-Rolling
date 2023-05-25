import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import { Form, Collapse, InputGroup, Button } from "react-bootstrap";
import { Tooltip, message } from "antd";
import { faShareNodes, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SharePaper.css";

function SharePaper() {
	const paperId = useSelector((state) => state.paperReducer.paperId);
	const [isShare, setIsShare] = useState(false);
	const paperUrlRef = useRef();

	const [messageApi, contextHolder] = message.useMessage();

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
			messageApi.open({
				type: "info",
				content: "링크를 복사했습니다!",
			});
		});
	};

	return (
		<>
			{contextHolder}
			<div className="sharePaper-container">
				<button className="sharePaper-btn" onClick={showShareLink}>
					<FontAwesomeIcon icon={faShareNodes} />내 페이퍼 공유하기
				</button>
				<Collapse in={isShare}>
					<div className="sharePaper-link">
						<InputGroup>
							<Form.Control
								type="text"
								readOnly
								ref={paperUrlRef}
								value={`https://rolling-rolling.web.app/paper/${paperId}`}
							/>
							<Tooltip title="링크 복사">
								<Button variant="secondary" onClick={onShareClick}>
									<FontAwesomeIcon icon={faCopy} />
								</Button>
							</Tooltip>
						</InputGroup>
					</div>
				</Collapse>
			</div>
		</>
	);
}

export default SharePaper;
