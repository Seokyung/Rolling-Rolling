import React, { useEffect, useState, useRef } from "react";
import { authService, dbService } from "api/fbase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useParams, useNavigate } from "react-router-dom";

import { Form, Button } from "react-bootstrap";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import "./PrivatePaper.css";

function PrivatePaper() {
	const { paperId } = useParams();
	const navigate = useNavigate();

	const [paperObj, setPaperObj] = useState({});
	const codeInputRef = useRef([]);
	const [codes, setCodes] = useState(Array(4).fill(""));

	const [validated, setValidated] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();
	const key = "updatable";

	useEffect(() => {
		const unsubscribe = onSnapshot(
			doc(dbService, "papers", `${paperId}`),
			(doc) => {
				const paperDocObj = {
					paperName: doc.data().paperName,
					paperCode: doc.data().paperCode,
				};
				setPaperObj(paperDocObj);
			}
		);
		onAuthStateChanged(authService, (user) => {
			if (user === null) {
				unsubscribe();
			}
		});
		if (codeInputRef.current[0]) {
			codeInputRef.current[0].focus();
			if (codes[0]) {
				codeInputRef.current[0].select();
			}
		}
	}, []);

	const closePrivatePaper = () => {
		navigate("/", { replace: true });
	};

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
					className="privatePaper-form-code"
					required
					key={index}
					type="password"
					inputmode="numeric"
					maxLength={1}
					value={code}
					ref={(el) => (codeInputRef.current[index] = el)}
					onChange={(e) => onCodeChange(e, index)}
					onKeyDown={(e) => handleKeyDown(e, index)}
				/>
			);
		});
	};

	const onSubmitCodes = async (e) => {
		e.preventDefault();
		if (codes.join("").length !== 4) {
			setValidated(true);
			messageApi.open({
				type: "error",
				content: "페이퍼 코드를 입력해주세요!",
				className: "alert-message-container",
			});
			return;
		}
		await messageApi.open({
			key,
			type: "loading",
			content: "로딩중...",
			className: "alert-message-container",
			duration: 0.7,
		});
		if (paperObj.paperCode === codes.join("")) {
			navigate(`/paper/${paperId}`, { replace: true });
		} else {
			messageApi.open({
				key,
				type: "error",
				content: "페이퍼 코드가 다릅니다!",
				className: "alert-message-container",
				duration: 2,
			});
			setCodes(Array(4).fill(""));
			codeInputRef.current[0].focus();
		}
	};

	return (
		<>
			{contextHolder}
			<div className="paper-wrapper">
				<div className="editPaper-container">
					<div className="editPaper-header-container">
						<button onClick={closePrivatePaper}>
							<FontAwesomeIcon icon={faAngleLeft} />
						</button>
						<div className="paper-title-container">
							<h2 className="editPaper-title">페이퍼 코드를 입력하세요 🤫</h2>
						</div>
					</div>
					<Form
						noValidate
						validated={validated}
						className="privatePaper-form-container"
					>
						<Form.Group className="privatePaper-form-code-group">
							{renderCodeInputs()}
						</Form.Group>
						<Button
							className="privatePaper-form-code-btn"
							onClick={onSubmitCodes}
						>
							제출
						</Button>
					</Form>
				</div>
			</div>
		</>
	);
}

export default PrivatePaper;
