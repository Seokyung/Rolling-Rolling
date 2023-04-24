import React, { useState, useRef, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { dbService } from "api/fbase";
import { useSelector } from "react-redux";

import { Modal, Form, InputGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./EditPaper.css";

function EditPaper({ paperCode, editModal, setEditModal }) {
	const paperId = useSelector((state) => state.paperReducer.paperId);
	const paperName = useSelector((state) => state.paperReducer.paperName);
	const isPrivate = useSelector((state) => state.paperReducer.isPrivate);

	const [newPaperName, setNewPaperName] = useState("");
	const [newIsPrivate, setNewIsPrivate] = useState(false);
	const [newPaperCode, setNewPaperCode] = useState([]);
	// const [newPaperCode, setNewPaperCode] = useState(useSelector((state) => state.paperReducer.paperCode));

	const paperNameRef = useRef();
	const codeInputRef = useRef([]);

	const [validated, setValidated] = useState(false);

	useEffect(() => {
		let paperCodeArr = ["", "", "", ""];
		for (let i = 0; i < 4; i++) {
			paperCodeArr[i] = paperCode[i];
		}
		setNewPaperName(paperName);
		setNewIsPrivate(isPrivate);
		setNewPaperCode(paperCodeArr);
	}, [editModal]);

	const closeEditModal = () => {
		setEditModal(false);
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
			closeEditModal();
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
			closeEditModal();
			alert("공개여부가 변경되었습니다!");
		}
	};

	return (
		<Modal
			show={editModal}
			onExit={closeEditModal}
			centered
			animation={true}
			keyboard={false}
			backdrop="static"
		>
			<Modal.Header className="createPaper-modal-header">
				<Modal.Title className="createPaper-modal-title">
					페이퍼 수정하기
				</Modal.Title>
				<button
					className="deletePaper-modal-close-btn"
					onClick={closeEditModal}
				>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			</Modal.Header>
			<Modal.Body>
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
			</Modal.Body>
			<Modal.Footer className="createPaper-modal-footer">
				<Button variant="secondary" size="lg" onClick={closeEditModal}>
					닫기
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default EditPaper;
