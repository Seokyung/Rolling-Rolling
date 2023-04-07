import React, { useState } from "react";
import { authService } from "api/fbase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import "./AuthForm.css";

function AuthForm({ onLoginMethodChange }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [newAccount, setNewAccount] = useState(false);

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
	};

	const toggleAuthForm = () => {
		setNewAccount((prev) => !prev);
	};

	const onAuthBtnClick = async (e) => {
		e.preventDefault();
		if (email === "" || password === "") {
			alert("이메일 / 비밀번호를 입력해주세요!");
			return;
		}
		try {
			if (newAccount) {
				await createUserWithEmailAndPassword(authService, email, password);
				alert("회원가입이 완료되었습니다!");
			} else {
				await signInWithEmailAndPassword(authService, email, password);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="authForm-container">
			<h3 className="authForm-title">{newAccount ? "회원가입" : "로그인"}</h3>
			<Form className="authForm-form-container" onSubmit={onAuthBtnClick}>
				<Form.Floating className="mb-3">
					<Form.Control
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={onAuthInputChange}
						placeholder="이메일을 입력해주세요"
					/>
					<label htmlFor="email">이메일</label>
				</Form.Floating>
				<FloatingLabel className="mb-3" label="비밀번호">
					<Form.Control
						type="password"
						name="password"
						value={password}
						onChange={onAuthInputChange}
						placeholder="비밀번호를 입력해주세요"
					/>
				</FloatingLabel>
				<Button variant="primary" type="submit">
					{newAccount ? "회원가입" : "로그인"}
				</Button>
				<Form.Text onClick={toggleAuthForm}>
					<span className="authForm-form-small-text">
						{newAccount
							? "이미 계정이 있으신가요? 로그인하기"
							: "계정이 없으신가요? 회원가입하기"}
					</span>
				</Form.Text>
				<Form.Text onClick={onLoginMethodChange}>
					<span className="authForm-form-small-text">돌아가기</span>
				</Form.Text>
			</Form>
		</div>
	);
}

export default AuthForm;
