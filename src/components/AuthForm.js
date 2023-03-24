import React, { useState } from "react";
import { authService } from "fbase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";

function AuthForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [newAccount, setNewAccount] = useState(false);
	const [error, setError] = useState("");

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
		try {
			if (newAccount) {
				await createUserWithEmailAndPassword(authService, email, password);
				alert("회원가입이 완료되었습니다!");
			} else {
				await signInWithEmailAndPassword(authService, email, password);
			}
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<div>
			<form onSubmit={onAuthBtnClick}>
				이메일:
				<input
					type="email"
					name="email"
					value={email}
					onChange={onAuthInputChange}
					placeholder="이메일을 입력해주세요"
				/>
				비밀번호:
				<input
					type="password"
					name="password"
					value={password}
					onChange={onAuthInputChange}
					placeholder="비밀번호를 입력해주세요"
				/>
				<input type="submit" value={newAccount ? "회원가입" : "로그인"} />
				{error && <span>{error}</span>}
			</form>
			<button onClick={toggleAuthForm}>
				{newAccount ? "로그인" : "회원가입"}
			</button>
		</div>
	);
}

export default AuthForm;