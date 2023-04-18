import React, { useState } from "react";
import { authService } from "api/fbase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";

import { Form, Button, InputGroup } from "react-bootstrap";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import "./AuthForm.css";

function AuthForm({ onLoginMethodChange }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [checkPassword, setCheckPassword] = useState("");
	const [newAccount, setNewAccount] = useState(false);

	const [validated, setValidated] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [messageApi, contextHolder] = message.useMessage();
	const key = "updatable";

	const onAuthInputChange = (e) => {
		const {
			target: { name, value },
		} = e;
		if (name === "email") {
			setEmail(value);
		}
		if (name === "password") {
			setPassword(value);
		}
		if (name === "checkPassword") {
			setCheckPassword(value);
		}
	};

	const toggleAuthForm = () => {
		setNewAccount((prev) => !prev);
		setValidated(false);
		setEmail("");
		setPassword("");
		setCheckPassword("");
		setErrorMsg("");
	};

	const onAuthBtnClick = async (e) => {
		e.preventDefault();

		const form = e.currentTarget;
		if (newAccount && password !== checkPassword) {
			setValidated(true);
			setErrorMsg("비밀번호가 일치하지 않습니다");
			setCheckPassword("");
			return;
		}
		if (form.checkValidity() === false) {
			e.preventDefault();
			e.stopPropagation();
			setValidated(true);
			return;
		}

		messageApi.open({
			key,
			type: "loading",
			content: `${newAccount ? "회원가입 중..." : "로그인 중..."}`,
			className: "alert-message-container",
		});

		try {
			if (newAccount) {
				await createUserWithEmailAndPassword(authService, email, password);
			} else {
				await signInWithEmailAndPassword(authService, email, password);
			}
			setValidated(false);
			setEmail("");
			setPassword("");
			setCheckPassword("");
			setErrorMsg("");
			messageApi.open({
				key,
				type: "success",
				content: `${
					newAccount ? "회원가입이 완료되었습니다!" : "로그인 되었습니다!"
				}`,
				duration: 2,
			});
		} catch (error) {
			messageApi.open({
				key,
				type: "error",
				content: `${newAccount ? "회원가입" : "로그인"}에 실패하였습니다 😢`,
				duration: 2,
			});
			setPassword("");
			setCheckPassword("");
			setValidated(true);
			setErrorMsg(`이메일 또는 비밀번호가 올바르지 않습니다 (${error.code})`);
			console.log(error.code);
		}
	};

	return (
		<>
			{contextHolder}
			<div className="authForm-container">
				<div className="authForm-header">
					<button className="authForm-header-btn" onClick={onLoginMethodChange}>
						<FontAwesomeIcon icon={faAngleLeft} />
					</button>
					<h3 className="authForm-header-title">
						{newAccount ? "회원가입" : "로그인"}
					</h3>
				</div>
				<Form
					className="authForm-form-container"
					noValidate
					validated={validated}
					onSubmit={onAuthBtnClick}
				>
					<Form.Group className="authForm-form-group">
						<Form.Label className="authForm-form-label">이메일</Form.Label>
						<InputGroup hasValidation>
							<Form.Control
								className="authForm-input-text"
								required
								type="email"
								id="email"
								name="email"
								value={email}
								onChange={onAuthInputChange}
								placeholder="이메일을 입력해주세요"
							/>
							<Form.Control.Feedback
								type="invalid"
								className="authForm-form-feedback"
							>
								이메일을 입력해주세요!
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Group>
					<Form.Group className="authForm-form-group">
						<Form.Label className="authForm-form-label">비밀번호</Form.Label>
						<InputGroup hasValidation>
							<Form.Control
								className="authForm-input-pw"
								required
								type="password"
								name="password"
								value={password}
								onChange={onAuthInputChange}
								placeholder="비밀번호를 입력해주세요"
							/>
							<Form.Control.Feedback
								type="invalid"
								className="authForm-form-feedback"
							>
								비밀번호를 입력해주세요!
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Group>
					{newAccount && (
						<Form.Group className="authForm-form-group">
							<Form.Label className="authForm-form-label">
								비밀번호 확인
							</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									className="authForm-input-pw"
									required
									type="password"
									name="checkPassword"
									value={checkPassword}
									onChange={onAuthInputChange}
									placeholder="비밀번호를 한번 더 입력해주세요"
								/>
								<Form.Control.Feedback
									type="invalid"
									className="authForm-form-feedback"
								>
									비밀번호를 한번 더 입력해주세요!
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>
					)}
					{errorMsg && (
						<Form.Text className="authForm-form-error">{errorMsg}</Form.Text>
					)}
					<Button className="authForm-btn" variant="primary" type="submit">
						<span>{newAccount ? "회원가입" : "로그인"}</span>
					</Button>
				</Form>
				<div className="authForm-small-container">
					<span className="authForm-small-toggle-text" onClick={toggleAuthForm}>
						{newAccount
							? "이미 계정이 있으신가요? 로그인하기"
							: "계정이 없으신가요? 회원가입하기"}
					</span>
				</div>
			</div>
		</>
	);
}

export default AuthForm;
