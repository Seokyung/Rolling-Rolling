import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { dbService } from "api/fbase";
import { useSelector } from "react-redux";

import { Modal } from "react-bootstrap";
import "./EditPaper.css";

function EditPaper({ paperCode, editModal, setEditModal }) {
	const paperId = useSelector((state) => state.paperReducer.paperId);
	const [newPaperName, setNewPaperName] = useState(
		useSelector((state) => state.paperReducer.paperName)
	);
	const [newIsPrivate, setNewIsPrivate] = useState(
		useSelector((state) => state.paperReducer.isPrivate)
	);
	const [newPaperCode, setNewPaperCode] = useState(paperCode);
	// const [newPaperCode, setNewPaperCode] = useState(useSelector((state) => state.paperReducer.paperCode));

	const closeEditModal = () => {
		setEditModal(false);
	};

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
			setNewPaperCode(value.slice(0, maxLength));
		}
		if (!isNaN(value)) {
			setNewPaperCode(value);
		}
	};

	const onEditPaperName = async (e) => {
		e.preventDefault();
		const isEdit = window.confirm("페이퍼 이름을 수정하시겠습니까?");
		if (isEdit) {
			const paperRef = doc(dbService, "papers", `${paperId}`);
			await updateDoc(paperRef, {
				paperName: newPaperName,
			});
			closeEditModal();
			alert("이름이 수정되었습니다!");
		}
	};

	const onEditPaperPrivate = async (e) => {
		e.preventDefault();
		if (newIsPrivate && newPaperCode === "") {
			alert("페이퍼 코드를 입력해주세요!");
			return;
		}
		if (newIsPrivate && newPaperCode.length !== 4) {
			alert("코드는 4자리의 숫자여야 합니다!");
			return;
		}
		const isEdit = window.confirm("페이퍼 공개여부를 변경하시겠습니까?");
		if (isEdit) {
			const paperRef = doc(dbService, "papers", `${paperId}`);
			await updateDoc(paperRef, {
				isPrivate: newIsPrivate,
				paperCode: newIsPrivate ? newPaperCode : "",
			});
			closeEditModal();
			alert("공개여부가 변경되었습니다!");
		}
	};

	return (
		<Modal
			show={editModal}
			onExit={closeEditModal}
			centered
			animation={true}
			keyboard={false}
			backdrop="static"
		>
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
						placeholder="4자리 숫자 코드를 설정해주세요!"
					/>
				)}
				<input type="submit" value="공개여부 변경" />
			</form>
			<button onClick={closeEditModal}>닫기</button>
		</Modal>
	);
}

export default EditPaper;
