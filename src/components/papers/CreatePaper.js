import React, { useState } from "react";
import { dbService } from "api/fbase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

function CreatePaper({ setPaperModal }) {
	const userId = useSelector((state) => state.userReducer.uid);
	const [paperName, setPaperName] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [paperCode, setPaperCode] = useState("");

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

	const onPaperCodeChange = (e) => {
		const {
			target: { value, maxLength },
		} = e;
		if (value.length > maxLength) {
			setPaperCode(value.slice(0, maxLength));
		}
		if (!isNaN(value)) {
			setPaperCode(value);
		}
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
		const newPaper = doc(collection(dbService, "papers"));
		const paperObj = {
			paperId: newPaper.id,
			paperName: paperName,
			createdAt: Date.now(),
			creatorId: userId,
			isPrivate: isPrivate,
			paperCode: paperCode,
		};
		try {
			await setDoc(newPaper, paperObj);
			alert(`${paperName} 페이지가 생성되었습니다!`);
		} catch (error) {
			alert("페이퍼 생성에 실패하였습니다 :(");
			console.log(error);
		}
		setPaperName("");
		setPaperModal((prev) => !prev);
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
				<input
					type="checkbox"
					checked={isPrivate}
					onChange={onPrivateCheckChange}
				/>
				<label htmlFor="isPrivate">비공개</label>
				{isPrivate && (
					<input
						type="text"
						value={paperCode}
						onChange={onPaperCodeChange}
						maxLength="4"
						placeholder="4자리 숫자 코드를 설정해주세요!"
					/>
				)}
				<input type="submit" value="페이퍼 만들기" />
			</form>
		</div>
	);
}

export default CreatePaper;
