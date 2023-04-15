import React, { useRef, useState, useEffect } from "react";
import { dbService } from "api/fbase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./CreatePaper.css";

function CreatePaper({ paperModal, setPaperModal }) {
	const userId = useSelector((state) => state.userReducer.uid);
	const [paperName, setPaperName] = useState("");
	const [paperCode, setPaperCode] = useState(Array(4).fill(""));
	const [isPrivate, setIsPrivate] = useState(false);
	const codeInputRef = useRef([]);

	const closePaperModal = () => {
		setPaperName("");
		setIsPrivate(false);
		setPaperCode(Array(4).fill(""));
		setPaperModal(false);
	};

	const onPaperNameChange = (e) => {
		const {
			target: { value },
		} = e;
		setPaperName(value);
	};

	const onPrivateCheckChange = (e) => {
		const {
			target: { checked },
		} = e;
		setIsPrivate(checked);
	};

	const onCodeChange = (e, index) => {
		const {
			target: { value },
		} = e;
		if (!isNaN(value)) {
			const newCodes = [...paperCode];
			newCodes[index] = value;
			setPaperCode(newCodes);
			if (value && index < codeInputRef.current.length - 1) {
				codeInputRef.current[index + 1].focus();
				if (paperCode[index + 1]) {
					codeInputRef.current[index + 1].select();
				}
			}
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace") {
			if (!paperCode[index] && index > 0) {
				codeInputRef.current[index - 1].focus();
			}
			const newCodes = [...paperCode];
			newCodes[index] = "";
			setPaperCode(newCodes);
		}
	};

	useEffect(() => {
		if (isPrivate && codeInputRef.current[0]) {
			codeInputRef.current[0].focus();
			if (paperCode[0]) {
				codeInputRef.current[0].select();
			}
		}
	}, [isPrivate]);

	const renderCodeInputs = () => {
		return paperCode.map((code, index) => {
			return (
				<Form.Control
					className="createPaper-form-code"
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

	const onCreatePaper = async (e) => {
		e.preventDefault();
		if (paperName === "") {
			alert("페이퍼 이름를 작성해주세요!");
			return;
		}
		if (isPrivate && paperCode === "") {
			alert("페이퍼 코드를 작성해주세요!");
			return;
		}
		if (isPrivate && paperCode.length !== 4) {
			alert("코드는 4자리의 숫자여야 합니다!");
			return;
		}

		const currentTime = new Date();
		const year = currentTime.getFullYear();
		const month = String(currentTime.getMonth() + 1).padStart(2, "0");
		const date = String(currentTime.getDate()).padStart(2, "0");
		const formattedDate = `${year}/${month}/${date}`;

		const hours = String(currentTime.getHours()).padStart(2, "0");
		const minutes = String(currentTime.getMinutes()).padStart(2, "0");
		const seconds = String(currentTime.getSeconds()).padStart(2, "0");
		const formattedTime = `${hours}:${minutes}:${seconds}`;

		const formattedDateTime = `${formattedDate} ${formattedTime}`;

		const newPaper = doc(collection(dbService, "papers"));
		const paperObj = {
			paperId: newPaper.id,
			paperName: paperName,
			createdAt: formattedDateTime,
			creatorId: userId,
			isPrivate: isPrivate,
			paperCode: paperCode.join(""),
		};
		try {
			await setDoc(newPaper, paperObj);
			alert(`${paperName} 페이지가 생성되었습니다!`);
		} catch (error) {
			alert("페이퍼 생성에 실패하였습니다 :(");
			console.log(error);
		}
		setPaperName("");
		closePaperModal();
	};

	return (
		<Modal
			show={paperModal}
			onExit={closePaperModal}
			centered
			animation={true}
			keyboard={false}
			backdrop="static"
		>
			<Modal.Header>
				<div className="createPaper-modal-header">
					<Modal.Title bsPrefix="createPaper-modal-title">
						페이퍼 만들기
					</Modal.Title>
					<button
						className="createPaper-modal-close-btn"
						onClick={closePaperModal}
					>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</div>
			</Modal.Header>
			<Modal.Body>
				<Form className="createPaper-form-container">
					<Form.Group className="createPaper-form-group">
						<Form.Label className="createPaper-form-title">
							페이퍼 이름
						</Form.Label>
						<Form.Control
							className="createPaper-form-text"
							type="text"
							autoFocus
							value={paperName}
							onChange={onPaperNameChange}
							placeholder="페이퍼 이름을 입력하세요 :)"
						/>
					</Form.Group>
					<Form.Group className="createPaper-form-group">
						<Form.Check type="checkbox" className="createPaper-form-title">
							<Form.Check.Input
								type="checkbox"
								checked={isPrivate}
								onChange={onPrivateCheckChange}
							/>
							<Form.Check.Label>비공개</Form.Check.Label>
						</Form.Check>
					</Form.Group>
					{isPrivate && (
						<Form.Group className="createPaper-form-code-group">
							{renderCodeInputs()}
						</Form.Group>
					)}
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<div className="createPaper-modal-footer">
					<Button
						className="createPaper-modal-footer-btn"
						variant="secondary"
						size="lg"
						onClick={closePaperModal}
					>
						닫기
					</Button>
					<Button
						className="createPaper-modal-footer-btn"
						variant="primary"
						size="lg"
						onClick={onCreatePaper}
					>
						페이퍼 만들기
					</Button>
				</div>
			</Modal.Footer>
		</Modal>
	);
}

export default CreatePaper;
