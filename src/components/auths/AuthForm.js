import React, { useRef, useState } from "react";
import { authService } from "api/fbase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";

import { Form, Button } from "react-bootstrap";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import "./AuthForm.css";

function AuthForm({ onLoginMethodChange }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [checkPassword, setCheckPassword] = useState("");
	const [newAccount, setNewAccount] = useState(false);

	const emailRef = useRef();
	const pwRef = useRef();
	const checkPwRef = useRef();

	const [isPwInValid, setIsPwInValid] = useState(false);
	const [isPwValid, setIsPwValid] = useState(false);
	const [checkPwMsg, setCheckPwMsg] = useState("");

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
			if (newAccount && checkPassword !== value) {
				setIsPwInValid(true);
				setIsPwValid(false);
				setCheckPwMsg("비밀번호가 일치하지 않습니다");
			} else if (newAccount && password && checkPassword === value) {
				setIsPwInValid(false);
				setIsPwValid(true);
				setCheckPwMsg("비밀번호가 일치합니다");
			}
		}
		if (name === "checkPassword") {
			setCheckPassword(value);
			if (newAccount && password !== value) {
				setIsPwInValid(true);
				setIsPwValid(false);
				setCheckPwMsg("비밀번호가 일치하지 않습니다");
			} else if (newAccount && password && password === value) {
				setIsPwInValid(false);
				setIsPwValid(true);
				setCheckPwMsg("비밀번호가 일치합니다");
			}
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

		if (newAccount && password !== checkPassword) {
			checkPwRef.current.focus();
			setCheckPassword("");
			setCheckPwMsg("비밀번호가 일치하지 않습니다");
			setValidated(true);
			return;
		}
		if (emailRef.current.checkValidity() === false) {
			emailRef.current.focus();
			setValidated(true);
			return;
		}
		if (pwRef.current.checkValidity() === false) {
			pwRef.current.focus();
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
					newAccount ? "회원가입이 완료되었습니다!" : "로그인되었습니다!"
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
			if (newAccount) {
				setErrorMsg("유효하지 않은 이메일 또는 비밀번호입니다");
			} else {
				setErrorMsg("이메일 또는 비밀번호가 올바르지 않습니다");
			}
			setPassword("");
			setCheckPassword("");
			setValidated(true);
			console.log(error.code);
		}
	};

	return (
		<>
			{contextHolder}
			<div className="login-container">
				<div className="authForm-header">
					<button className="authForm-prev-btn" onClick={onLoginMethodChange}>
						<FontAwesomeIcon icon={faAngleLeft} />
					</button>
					<h3 className="login-title">{newAccount ? "회원가입" : "로그인"}</h3>
				</div>
				<Form
					className="authForm-form-container"
					noValidate
					validated={validated}
					onSubmit={onAuthBtnClick}
				>
					<Form.Group className="authForm-form-group">
						<Form.Label className="authForm-form-label">이메일</Form.Label>
						<Form.Control
							className="authForm-input-text"
							autoFocus
							required
							type="email"
							id="email"
							name="email"
							value={email}
							ref={emailRef}
							onChange={onAuthInputChange}
							placeholder="이메일을 입력해주세요"
						/>
						<Form.Control.Feedback
							type="invalid"
							className="authForm-form-feedback"
						>
							이메일을 입력해주세요!
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="authForm-form-group">
						<Form.Label className="authForm-form-label">비밀번호</Form.Label>
						<Form.Control
							className="authForm-input-pw"
							required
							type="password"
							name="password"
							value={password}
							ref={pwRef}
							onChange={onAuthInputChange}
							placeholder="비밀번호를 입력해주세요"
						/>
						<Form.Control.Feedback
							type="invalid"
							className="authForm-form-feedback"
						>
							비밀번호를 입력해주세요!
						</Form.Control.Feedback>
					</Form.Group>
					{newAccount && (
						<Form.Group className="authForm-form-group">
							<Form.Label className="authForm-form-label">
								비밀번호 확인
							</Form.Label>
							<Form.Control
								className="authForm-input-pw"
								required
								isInvalid={isPwInValid}
								isValid={isPwValid}
								type="password"
								name="checkPassword"
								value={checkPassword}
								ref={checkPwRef}
								onChange={onAuthInputChange}
								placeholder="비밀번호를 한번 더 입력해주세요"
							/>
							<Form.Control.Feedback
								type="invalid"
								className="authForm-form-feedback"
							>
								{checkPwMsg}
							</Form.Control.Feedback>
						</Form.Group>
					)}
					{errorMsg && (
						<Form.Text className="authForm-form-error">{errorMsg}</Form.Text>
					)}
					<Button className="authForm-btn" variant="primary" type="submit">
						{newAccount ? "회원가입" : "로그인"}
					</Button>
				</Form>
				<span className="login-form-text" onClick={toggleAuthForm}>
					{newAccount
						? "이미 계정이 있으신가요? 로그인하기"
						: "계정이 없으신가요? 회원가입하기"}
				</span>
			</div>
		</>
	);
}

export default AuthForm;
