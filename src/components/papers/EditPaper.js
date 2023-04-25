import React, { useState, useRef, useEffect } from "react";
import { authService, dbService } from "api/fbase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Modal, Form, InputGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./EditPaper.css";

function EditPaper() {
	const paperId = useSelector((state) => state.paperReducer.paperId);
	const navigate = useNavigate();

	const [newPaperName, setNewPaperName] = useState("");
	const [newIsPrivate, setNewIsPrivate] = useState(false);
	const [newPaperCode, setNewPaperCode] = useState(Array(4).fill(""));

	const paperNameRef = useRef();
	const codeInputRef = useRef([]);

	const [validated, setValidated] = useState(false);

	useEffect(() => {
		const unsubscribe = onSnapshot(
			doc(dbService, "papers", `${paperId}`),
			(doc) => {
				setNewPaperName(doc.data().paperName);
				setNewIsPrivate(doc.data().isPrivate);
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
		setNewPaperName(value);
	};

	const onPrivateCheckChange = (e) => {
		const {
			target: { checked },
		} = e;
		setNewIsPrivate(checked);
	};

	const onCodeChange = (e, index) => {
		const {
			target: { value },
		} = e;
		if (!isNaN(value)) {
			const newCodes = [...newPaperCode];
			newCodes[index] = value;
			setNewPaperCode(newCodes);
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

	// useEffect(() => {
	// 	if (newIsPrivate && codeInputRef.current[0]) {
	// 		codeInputRef.current[0].focus();
	// 		if (newPaperCode[0]) {
	// 			codeInputRef.current[0].select();
	// 		}
	// 	}
	// }, [newIsPrivate]);

	const renderCodeInputs = () => {
		return newPaperCode.map((code, index) => {
			return (
				<Form.Control
					className="createPaper-form-code"
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

	const onEditPaperName = async (e) => {
		e.preventDefault();
		if (newPaperName === "") {
			paperNameRef.current.focus();
			setValidated(true);
			return;
		}
		const isEdit = window.confirm("페이퍼 이름을 수정하시겠습니까?");
		if (isEdit) {
			const paperRef = doc(dbService, "papers", `${paperId}`);
			await updateDoc(paperRef, {
				paperName: newPaperName,
			});
			alert("이름이 수정되었습니다!");
		}
	};

	const onEditPaperPrivate = async (e) => {
		e.preventDefault();
		if (newIsPrivate && newPaperCode.join("").length !== 4) {
			codeInputRef.current[0].focus();
			setValidated(true);
			return;
		}
		// if (newIsPrivate && newPaperCode === "") {
		// 	alert("페이퍼 코드를 입력해주세요!");
		// 	return;
		// }
		// if (newIsPrivate && newPaperCode.length !== 4) {
		// 	alert("코드는 4자리의 숫자여야 합니다!");
		// 	return;
		// }
		const isEdit = window.confirm("페이퍼 공개여부를 변경하시겠습니까?");
		if (isEdit) {
			const paperRef = doc(dbService, "papers", `${paperId}`);
			await updateDoc(paperRef, {
				isPrivate: newIsPrivate,
				paperCode: newIsPrivate ? newPaperCode.join("") : "",
			});
			alert("공개여부가 변경되었습니다!");
		}
	};

	return (
		<div>
			<div className="createPaper-modal-header">
				<div className="createPaper-modal-title">페이퍼 수정하기</div>
				<button className="deletePaper-modal-close-btn">
					<FontAwesomeIcon icon={faXmark} />
				</button>
			</div>
			<div>
				<Form noValidate validated={validated}>
					<Form.Group className="createPaper-form-group">
						<Form.Label className="createPaper-form-title">
							페이퍼 이름
						</Form.Label>
						<InputGroup>
							<Form.Control
								type="text"
								required
								value={newPaperName}
								ref={paperNameRef}
								onChange={onPaperNameChange}
								onKeyDown={(e) => handleInputEnter(e)}
								className="createPaper-form-text"
								placeholder="페이퍼 이름을 입력하세요 :)"
							/>
							<Button onClick={onEditPaperName}>이름 수정</Button>
							<Form.Control.Feedback
								className="createPaper-form-group-text"
								type="invalid"
							>
								페이퍼 이름을 입력해주세요!
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Group>
					<Form.Group className="createPaper-form-group">
						<Form.Check type="checkbox" className="createPaper-form-title">
							<Form.Check.Input
								type="checkbox"
								checked={newIsPrivate}
								onChange={onPrivateCheckChange}
							/>
							<Form.Check.Label>비공개</Form.Check.Label>
						</Form.Check>
						<Form.Text className="createPaper-form-group-text">
							페이퍼의 공개여부를 설정해주세요
						</Form.Text>
						<Button onClick={onEditPaperPrivate}>공개여부 변경</Button>
					</Form.Group>
					{newIsPrivate && (
						<Form.Group className="createPaper-form-group">
							<Form.Group className="createPaper-form-code-group">
								{renderCodeInputs()}
								<Form.Control.Feedback
									className="createPaper-form-group-text"
									type="invalid"
								>
									페이퍼 코드가 올바르지 않습니다!
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Text className="createPaper-form-code-group-text">
								4자리의 숫자로 이루어진 코드를 입력해주세요
							</Form.Text>
						</Form.Group>
					)}
				</Form>
			</div>
			<div className="createPaper-modal-footer">
				<Button variant="secondary" size="lg" onClick={closeEditPaper}>
					닫기
				</Button>
				{/* <Button id="create-btn" size="lg">
					수정하기
				</Button> */}
			</div>
		</div>
	);
}

export default EditPaper;
