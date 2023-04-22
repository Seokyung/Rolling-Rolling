import React, { useEffect, useState, useRef } from "react";

import { Form, Button } from "react-bootstrap";
import { message } from "antd";
import "./PrivatePaper.css";

function PrivatePaper({ isPrivate, setIsPrivate, paperCode }) {
	const codeInputRef = useRef([]);
	const [codes, setCodes] = useState(Array(4).fill(""));

	const [messageApi, contextHolder] = message.useMessage();

	const onCodeChange = (e, index) => {
		const {
			target: { value },
		} = e;
		if (!isNaN(value)) {
			const newCodes = [...codes];
			newCodes[index] = value;
			setCodes(newCodes);
			if (value && index < codeInputRef.current.length - 1) {
				codeInputRef.current[index + 1].focus();
				if (codes[index + 1]) {
					codeInputRef.current[index + 1].select();
				}
			}
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace") {
			if (!codes[index] && index > 0) {
				codeInputRef.current[index - 1].focus();
			}
			const newCodes = [...codes];
			newCodes[index] = "";
			setCodes(newCodes);
		}
	};

	const renderCodeInputs = () => {
		return codes.map((code, index) => {
			return (
				<Form.Control
					className="paper-form-code"
					key={index}
					type="password"
					maxLength={1}
					value={code}
					ref={(el) => (codeInputRef.current[index] = el)}
					onChange={(e) => onCodeChange(e, index)}
					onKeyDown={(e) => handleKeyDown(e, index)}
				/>
			);
		});
	};

	useEffect(() => {
		if (isPrivate && codeInputRef.current[0]) {
			codeInputRef.current[0].focus();
			if (codes[0]) {
				codeInputRef.current[0].select();
			}
		}
	}, [isPrivate]);

	const onSubmitCodes = (e) => {
		e.preventDefault();
		if (paperCode === codes.join("")) {
			setIsPrivate(false);
			setCodes(Array(4).fill(""));
		} else {
			messageApi.open({
				type: "error",
				content: "페이지 비밀번호가 다릅니다!",
			});
			setCodes(Array(4).fill(""));
			codeInputRef.current[0].focus();
		}
	};

	return (
		<>
			{contextHolder}
			<Form>
				<Form.Group className="paper-form-code-container">
					<Form.Label className="paper-form-code-title">
						페이지 비밀번호를 입력하세요!
					</Form.Label>
					<div className="paper-form-code-group">{renderCodeInputs()}</div>
					<Button className="paper-form-code-btn" onClick={onSubmitCodes}>
						제출
					</Button>
				</Form.Group>
			</Form>
		</>
	);
}

export default PrivatePaper;
