import React, { useState } from "react";

function Auth() {
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

	const onAuthBtnClick = (e) => {
		e.preventDefault();
		if (email !== "" && password !== "") {
			const alertMsg = newAccount
				? "회원가입이 완료되었습니다!"
				: "로그인되었습니다!";
			alert(alertMsg);
		}
	};

	const toggleAuthForm = () => {
		setNewAccount((prev) => !prev);
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
			</form>
			<button onClick={toggleAuthForm}>
				{newAccount ? "로그인" : "회원가입"}
			</button>
		</div>
	);
}

export default Auth;
