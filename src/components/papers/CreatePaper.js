import React, { useState } from "react";

function CreatePaper() {
	const [paperName, setPaperName] = useState("");

	const onPaperNameChange = (e) => {
		const {
			target: { value },
		} = e;
		setPaperName(value);
	};

	const onCreatePaper = (e) => {
		e.preventDefault();
		alert(`${paperName}이 생성되었습니다!`);
	};

	return (
		<div>
			<h4>Create Paper</h4>
			<form onSubmit={onCreatePaper}>
				페이퍼 이름:
				<input
					type="text"
					autoFocus
					onChange={onPaperNameChange}
					placeholder="페이퍼 이름을 입력하세요 :)"
				/>
				<input type="submit" value="페이퍼 만들기" />
			</form>
		</div>
	);
}

export default CreatePaper;
