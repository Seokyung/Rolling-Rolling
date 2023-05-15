import React, { useRef, useState, useEffect } from "react";
import { dbService } from "api/fbase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

import { Modal, Button, Form, CloseButton } from "react-bootstrap";
import { message } from "antd";
import "./CreatePaper.css";

function CreatePaper({ paperModal, setPaperModal }) {
	const userId = useSelector((state) => state.userReducer.uid);
	const [paperName, setPaperName] = useState("");
	const [paperCode, setPaperCode] = useState(Array(4).fill(""));
	const [isPrivate, setIsPrivate] = useState(false);
	const paperNameRef = useRef();
	const codeInputRef = useRef([]);

	const [currentNameLength, setCurrentNameLength] = useState(0);
	const maxNameLength = 50;

	const [validated, setValidated] = useState(false);

	const [messageApi, contextHolder] = message.useMessage();
	const key = "updatable";

	const closePaperModal = () => {
		setPaperName("");
		setIsPrivate(false);
		setPaperCode(Array(4).fill(""));
		setCurrentNameLength(0);
		setValidated(false);
		setPaperModal(false);
	};

	const onPaperNameChange = (e) => {
		const {
			target: { value },
		} = e;
		if (value.length <= maxNameLength) {
			setPaperName(value);
			setCurrentNameLength(value.length);
		}
	};

	const onPrivateCheckChange = (e) => {
		const {
			target: { checked },
		} = e;
		setIsPrivate(checked);
		if (checked === false) {
			setPaperCode(Array(4).fill(""));
		}
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
			if (!paperCode[index] && index > 0) {
				codeInputRef.current[index - 1].focus();
			}
			const newCodes = [...paperCode];
			newCodes[index] = "";
			setPaperCode(newCodes);
			return;
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

	const onCreatePaper = async (e) => {
		e.preventDefault();

		if (paperName === "") {
			paperNameRef.current.focus();
			setValidated(true);
			return;
		}
		if (isPrivate && paperCode.join("").length !== 4) {
			codeInputRef.current[0].focus();
			setValidated(true);
			return;
		}

		await messageApi.open({
			key,
			type: "loading",
			content: "페이퍼 생성중...",
			duration: 0.5,
		});

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
			messageApi.open({
				key,
				type: "success",
				content: `${paperName} 페이퍼가 생성되었습니다!`,
				duration: 2,
			});
		} catch (error) {
			messageApi.open({
				key,
				type: "error",
				content: "페이퍼 생성에 실패하였습니다 😢",
				duration: 2,
			});
			console.log(error.code);
		}
		closePaperModal();
	};

	return (
		<>
			{contextHolder}
			<Modal
				show={paperModal}
				onExit={closePaperModal}
				centered
				animation={true}
				keyboard={false}
				backdrop="static"
			>
				<Modal.Header className="create-modal-header">
					<Modal.Title className="create-modal-title">
						페이퍼 만들기
					</Modal.Title>
					<CloseButton className="modal-close-btn" onClick={closePaperModal} />
				</Modal.Header>
				<Modal.Body>
					<Form noValidate validated={validated}>
						<Form.Group className="create-form-group">
							<Form.Label className="create-form-title">페이퍼 이름</Form.Label>
							<Form.Control
								className="create-form-input"
								required
								autoFocus
								type="text"
								value={paperName}
								ref={paperNameRef}
								maxLength={maxNameLength}
								onChange={onPaperNameChange}
								onKeyDown={(e) => handleInputEnter(e)}
								placeholder="페이퍼 이름을 입력해주세요 :)"
							/>
							<Form.Control.Feedback
								className="create-form-feedback"
								type="invalid"
							>
								페이퍼 이름을 입력해주세요!
							</Form.Control.Feedback>
							<Form.Text className="create-form-length-text">
								{currentNameLength} / {maxNameLength}
							</Form.Text>
						</Form.Group>
						<Form.Group className="create-form-group">
							<Form.Check type="checkbox" className="create-form-title">
								<Form.Check.Input
									type="checkbox"
									checked={isPrivate}
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
						{isPrivate && (
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
					</Form>
				</Modal.Body>
				<Modal.Footer className="create-modal-footer">
					<Button id="create-btn" size="lg" onClick={onCreatePaper}>
						페이퍼 만들기
					</Button>
					<Button
						id="close-btn"
						variant="outline-secondary"
						size="lg"
						onClick={closePaperModal}
					>
						닫기
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default CreatePaper;
