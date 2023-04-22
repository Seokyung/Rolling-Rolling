import React from "react";
import { useNavigate } from "react-router-dom";
import { dbService, storageService } from "api/fbase";
import { doc, deleteDoc, query, collection, getDocs } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import { Offcanvas } from "react-bootstrap";
import "./PaperSettings.css";

function PaperSettings({
	paperSettings,
	setPaperSettings,
	setEditModal,
	paperId,
}) {
	const navigate = useNavigate();

	const showPaperSettings = () => {
		setPaperSettings((prev) => !prev);
	};

	const openEditModal = () => {
		setPaperSettings(false);
		setEditModal(true);
	};

	const deletePaper = async () => {
		const isDelete = window.confirm("페이퍼를 삭제하시겠습니까?");
		if (isDelete) {
			try {
				const msgQuery = query(
					collection(dbService, "papers", `${paperId}`, "messages")
				);
				const msgSnapshot = await getDocs(msgQuery);
				msgSnapshot.forEach(async (msg) => {
					const msgRef = doc(
						dbService,
						"papers",
						`${paperId}`,
						"messages",
						`${msg.id}`
					);
					if (msg.data().msgImg !== "") {
						const urlRef = ref(storageService, msg.data().msgImg);
						await deleteObject(urlRef);
					}
					await deleteDoc(msgRef);
				});
				const paperRef = doc(dbService, "papers", `${paperId}`);
				await deleteDoc(paperRef);
				alert("페이퍼가 삭제되었습니다!");
			} catch (error) {
				console.log(error.code);
			} finally {
				navigate("/", { replace: true });
			}
		}
	};

	return (
		<Offcanvas
			show={paperSettings}
			onHide={showPaperSettings}
			placement="bottom"
		>
			<Offcanvas.Header closeButton>페이퍼 설정</Offcanvas.Header>
			<Offcanvas.Body>
				<button onClick={openEditModal}>페이퍼 수정</button>
				<button onClick={deletePaper}>페이퍼 삭제</button>
			</Offcanvas.Body>
		</Offcanvas>
	);
}

export default PaperSettings;
