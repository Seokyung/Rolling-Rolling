import React, { useState } from "react";
import { dbService } from "fbase";
import { collection, doc, setDoc } from "firebase/firestore";

function CreatePaper() {
	const [paperName, setPaperName] = useState("");

	const onPaperNameChange = (e) => {
		const {
			target: { value },
		} = e;
		setPaperName(value);
	};

	const onCreatePaper = async (e) => {
		e.preventDefault();
		if (paperName === "") {
			return;
		}
		const newPaper = doc(collection(dbService, "papers"));
		const paperObj = {
			paperId: newPaper.id,
			paperName: paperName,
			createdAt: Date.now(),
		};
		try {
			await setDoc(newPaper, paperObj);
			alert(`${paperName}이 생성되었습니다!`);
		} catch (error) {
			alert("페이퍼 생성에 실패하였습니다 :(");
			console.log(error);
		}
		setPaperName("");
	};

	return (
		<div>
			<h4>Create Paper</h4>
			<form onSubmit={onCreatePaper}>
				페이퍼 이름:
				<input
					type="text"
					autoFocus
					value={paperName}
					onChange={onPaperNameChange}
					placeholder="페이퍼 이름을 입력하세요 :)"
				/>
				<input type="submit" value="페이퍼 만들기" />
			</form>
		</div>
	);
}

export default CreatePaper;
