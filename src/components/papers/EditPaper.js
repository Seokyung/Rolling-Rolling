import React, { useState, useRef, useEffect } from "react";
import { authService, dbService } from "api/fbase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useParams, useNavigate } from "react-router-dom";

import { Form, InputGroup, Button } from "react-bootstrap";
import { Divider, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "./EditPaper.css";

function EditPaper() {
	const { paperId } = useParams();
	const navigate = useNavigate();

	const [paperObj, setPaperObj] = useState({});
	const [newPaperName, setNewPaperName] = useState("");
	const [newIsPrivate, setNewIsPrivate] = useState(false);
	const [newPaperCode, setNewPaperCode] = useState(Array(4).fill(""));

	const paperNameRef = useRef();
	const codeInputRef = useRef([]);

	const [currentNameLength, setCurrentNameLength] = useState(0);
	const maxNameLength = 50;

	const [validated, setValidated] = useState(false);
	const [isNameValidate, setIsNameValidate] = useState(true);
	const [isPrivateValidate, setIsPrivateValidate] = useState(true);
	const [isCodeValidate, setIsCodeValidate] = useState(true);

	const [messageApi, contextHolder] = message.useMessage();
	const key = "updatable";

	useEffect(() => {
		const unsubscribe = onSnapshot(
			doc(dbService, "papers", `${paperId}`),
			(doc) => {
				const paperDocObj = {
					paperName: doc.data().paperName,
					isPrivate: doc.data().isPrivate,
					paperCode: doc.data().paperCode,
				};
				setPaperObj(paperDocObj);
				setNewPaperName(doc.data().paperName);
				setNewIsPrivate(doc.data().isPrivate);
				setCurrentNameLength(doc.data().paperName.length);
				if (doc.data().isPrivate) {
					const docPaperCode = doc.data().paperCode;
					setNewPaperCode(docPaperCode.split(""));
				}
			}
		);
		onAuthStateChanged(authService, (user) => {
			if (user === null) {
				unsubscribe();
			}
		});
	}, []);

	const closeEditPaper = () => {
		navigate(`/paper/${paperId}`, { replace: true });
	};

	const onPaperNameChange = (e) => {
		const {
			target: { value },
		} = e;
		if (value.length <= maxNameLength) {
			setNewPaperName(value);
			setCurrentNameLength(value.length);
		}
		if (value === paperObj.paperName) {
			setIsNameValidate(true);
		} else {
			setIsNameValidate(false);
		}
	};

	const onPrivateCheckChange = (e) => {
		const {
			target: { checked },
		} = e;
		setNewIsPrivate(checked);
		if (checked === paperObj.isPrivate) {
			setIsPrivateValidate(true);
		} else {
			setIsPrivateValidate(false);
		}
	};

	const onCodeChange = (e, index) => {
		const {
			target: { value },
		} = e;
		if (!isNaN(value)) {
			const newCodes = [...newPaperCode];
			newCodes[index] = value;
			setNewPaperCode(newCodes);
			if (newCodes.join("") === paperObj.paperCode) {
				setIsCodeValidate(true);
			} else {
				setIsCodeValidate(false);
			}
			if (value && index < codeInputRef.current.length - 1) {
				codeInputRef.current[index + 1].focus();
				if (newPaperCode[index + 1]) {
					codeInputRef.current[index + 1].select();
				}
			}
		}
	};

	const handleInputEnter = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			return;
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Enter") {
			e.preventDefault();
			return;
		}
		if (e.key === "Backspace") {
			if (!newPaperCode[index] && index > 0) {
				codeInputRef.current[index - 1].focus();
			}
			const newCodes = [...newPaperCode];
			newCodes[index] = "";
			setNewPaperCode(newCodes);
			return;
		}
	};

	const renderCodeInputs = () => {
		return newPaperCode.map((code, index) => {
			return (
				<Form.Control
					className="create-form-code"
					required
					key={index}
					type="text"
					maxLength={1}
					value={code}
					ref={(el) => (codeInputRef.current[index] = el)}
					onChange={(e) => onCodeChange(e, index)}
					onKeyDown={(e) => handleKeyDown(e, index)}
				/>
			);
		});
	};

	const onEditPaper = async (e) => {
		e.preventDefault();
		if (newPaperName === "") {
			paperNameRef.current.focus();
			setValidated(true);
			return;
		}
		if (newIsPrivate && newPaperCode.join("").length !== 4) {
			codeInputRef.current[0].focus();
			setValidated(true);
			return;
		}
		await messageApi.open({
			key,
			type: "loading",
			content: "페이퍼 수정중...",
			duration: 0.5,
		});
		const paperRef = doc(dbService, "papers", `${paperId}`);
		await updateDoc(paperRef, {
			paperName: newPaperName,
			isPrivate: newIsPrivate,
			paperCode: newIsPrivate ? newPaperCode.join("") : "",
		});
		messageApi.open({
			key,
			type: "success",
			content: `페이퍼가 수정되었습니다!`,
			duration: 2,
		});
		setValidated(false);
		setIsNameValidate(true);
		setIsPrivateValidate(true);
		setIsCodeValidate(true);
	};

	return (
		<>
			{contextHolder}
			<div className="paper-wrapper">
				<div className="editPaper-container">
					<div className="editPaper-header-container">
						<button onClick={closeEditPaper}>
							<FontAwesomeIcon icon={faAngleLeft} />
						</button>
						<div className="paper-title-container">
							<h2 className="editPaper-title">
								<FontAwesomeIcon
									className="icon-margin-right"
									icon={faPenToSquare}
								/>
								페이퍼 수정
							</h2>
						</div>
					</div>
					<Form
						noValidate
						validated={validated}
						className="editPaper-form-container"
					>
						<Form.Group className="create-form-group">
							<Form.Label className="create-form-title">페이퍼 이름</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									className="create-form-input"
									type="text"
									required
									value={newPaperName}
									ref={paperNameRef}
									maxLength={maxNameLength}
									onChange={onPaperNameChange}
									onKeyDown={(e) => handleInputEnter(e)}
									placeholder="페이퍼 이름을 입력하세요 :)"
								/>
								<Form.Control.Feedback
									className="create-form-feedback"
									type="invalid"
								>
									페이퍼 이름을 입력해주세요!
								</Form.Control.Feedback>
							</InputGroup>
							<Form.Text className="create-form-length-text">
								{currentNameLength} / {maxNameLength}
							</Form.Text>
						</Form.Group>
						<Divider />
						<Form.Group className="create-form-group">
							<Form.Check type="checkbox" className="create-form-title">
								<Form.Check.Input
									type="checkbox"
									checked={newIsPrivate}
									onChange={onPrivateCheckChange}
								/>
								<Form.Check.Label>🔒 비공개 페이퍼</Form.Check.Label>
							</Form.Check>
							<Form.Text className="create-form-text">
								페이퍼의 공개여부를 설정해주세요
							</Form.Text>
							<Form.Text className="create-form-text-small">
								(비공개 페이퍼는 코드를 입력해야만 볼 수 있어요🤫 )
							</Form.Text>
						</Form.Group>
						{newIsPrivate && (
							<Form.Group className="create-form-group">
								<Form.Group className="create-form-code-group">
									{renderCodeInputs()}
									<Form.Control.Feedback
										className="create-form-feedback"
										type="invalid"
									>
										페이퍼 코드가 올바르지 않습니다!
									</Form.Control.Feedback>
								</Form.Group>
								<Form.Text className="create-form-text">
									4자리의 숫자로 이루어진 코드를 입력해주세요
								</Form.Text>
							</Form.Group>
						)}
						<Divider />
						<div className="editPaper-edit-btn">
							<Button
								size="lg"
								disabled={isNameValidate && isPrivateValidate && isCodeValidate}
								onClick={onEditPaper}
							>
								수정하기
							</Button>
							<Button
								id="close-btn"
								variant="outline-secondary"
								size="lg"
								onClick={closeEditPaper}
							>
								닫기
							</Button>
						</div>
					</Form>
				</div>
			</div>
		</>
	);
}

export default EditPaper;
