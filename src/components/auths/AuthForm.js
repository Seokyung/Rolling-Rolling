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
		<div className="authFormContainerDesktop">
			<h3 className="authFormTitle">{newAccount ? "회원가입" : "로그인"}</h3>
			<Form className="authInputFormContainerDesktop" onSubmit={onAuthBtnClick}>
				<FloatingLabel className="mb-3" label="이메일">
					<Form.Control
						type="email"
						name="email"
						value={email}
						onChange={onAuthInputChange}
						placeholder="이메일을 입력해주세요"
					/>
				</FloatingLabel>
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
				<Form.Text className="authFormText" onClick={toggleAuthForm}>
					{newAccount
						? "이미 계정이 있으신가요? 로그인하기"
						: "계정이 없으신가요? 회원가입하기"}
				</Form.Text>
				<Form.Text className="authFormText" onClick={onLoginMethodChange}>
					돌아가기
				</Form.Text>
			</Form>
		</div>
	);
}

export default AuthForm;
