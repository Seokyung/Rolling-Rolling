import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { dbService } from "fbase";

function EditPaper({ paperObj, isOwner, setEditModal }) {
	const [newPaperName, setNewPaperName] = useState(paperObj.paperName);
	const [newIsPrivate, setNewIsPrivate] = useState(paperObj.isPrivate);
	const [newPaperCode, setNewPaperCode] = useState(paperObj.paperCode);

	const onPaperNameChange = (e) => {
		const {
			target: { value },
		} = e;
		setNewPaperName(value);
	};

	const onPrivateCheckChange = (e) => {
		const {
			target: { checked },
		} = e;
		setNewIsPrivate(checked);
	};

	const onPaperCodeChange = (e) => {
		const {
			target: { value, maxLength },
		} = e;
		if (value.length > maxLength) {
			value = value.slice(0, maxLength);
		}
		if (!isNaN(value)) {
			setNewPaperCode(value);
		}
	};

	const onEditPaperName = async (e) => {
		e.preventDefault();
		const isEdit = window.confirm("페이퍼 이름을 수정하시겠습니까?");
		if (isEdit && isOwner) {
			const paperRef = doc(dbService, "papers", `${paperObj.paperId}`);
			await updateDoc(paperRef, {
				paperName: newPaperName,
			});
			alert("이름이 수정되었습니다!");
			setNewPaperName("");
		}
	};

	const onEditPaperPrivate = async (e) => {
		e.preventDefault();
		if (newIsPrivate === true && newPaperCode === "") {
			alert("페이퍼 코드를 입력해주세요!");
			return;
		}
		const isEdit = window.confirm("페이퍼 공개여부를 변경하시겠습니까?");
		if (isEdit && isOwner) {
			const paperRef = doc(dbService, "papers", `${paperObj.paperId}`);
			await updateDoc(paperRef, {
				isPrivate: newIsPrivate,
				paperCode: newPaperCode,
			});
			alert("공개여부가 변경되었습니다!");
			setNewPaperCode("");
		}
	};

	const closeEditModal = () => {
		setEditModal((prev) => !prev);
	};

	return (
		<div>
			<form onSubmit={onEditPaperName}>
				<h4>Edit Paper</h4>
				페이퍼 이름:
				<input
					type="text"
					autoFocus
					value={newPaperName}
					onChange={onPaperNameChange}
					placeholder="페이퍼 이름을 입력하세요 :)"
				/>
				<input type="submit" value="이름 수정" />
			</form>
			<form onSubmit={onEditPaperPrivate}>
				<input
					type="checkbox"
					checked={newIsPrivate}
					onChange={onPrivateCheckChange}
				/>
				<label htmlFor="isPrivate">비공개</label>
				{newIsPrivate && (
					<input
						type="text"
						value={newPaperCode}
						onChange={onPaperCodeChange}
						maxLength="4"
						placeholder="4자리 비밀번호를 설정해주세요!"
					/>
				)}
				<input type="submit" value="공개여부 변경" />
			</form>
			<button onClick={closeEditModal}>닫기</button>
		</div>
	);
}

export default EditPaper;
