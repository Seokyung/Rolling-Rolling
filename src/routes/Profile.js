import React from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService, storageService } from "api/fbase";
import { signOut, deleteUser } from "firebase/auth";
import {
	doc,
	deleteDoc,
	query,
	collection,
	getDocs,
	where,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import EditProfile from "components/profile/EditProfile";
import { useSelector } from "react-redux";

function Profile({ refreshUser }) {
	const userObj = useSelector((state) => state.userReducer);
	const navigate = useNavigate();

	const onLogoutClick = async () => {
		const isLogout = window.confirm("로그아웃 하시겠습니까?");
		if (isLogout) {
			try {
				await signOut(authService);
				alert("로그아웃 되었습니다!");
				navigate("/", { replace: true });
			} catch (error) {
				alert(error.message);
			}
		}
	};

	const deletePaperData = async () => {
		try {
			const paperQuery = query(
				collection(dbService, "papers"),
				where("creatorId", "==", `${userObj.uid}`)
			);
			const paperSnapshot = await getDocs(paperQuery);
			paperSnapshot.forEach(async (paper) => {
				const msgQuery = query(
					collection(dbService, "papers", `${paper.id}`, "messages")
				);
				const msgSnapshot = await getDocs(msgQuery);
				msgSnapshot.forEach(async (msg) => {
					const msgRef = doc(
						dbService,
						"papers",
						`${paper.id}`,
						"messages",
						`${msg.id}`
					);
					if (msg.data().msgImg !== "") {
						const urlRef = ref(storageService, msg.data().msgImg);
						await deleteObject(urlRef);
					}
					await deleteDoc(msgRef);
				});
				const paperRef = doc(dbService, "papers", `${paper.id}`);
				await deleteDoc(paperRef);
			});
		} catch (error) {
			console.log(error.message);
		}
	};

	const deleteProfileImgData = async () => {
		const urlRef = ref(storageService, `${userObj.uid}/profileImg`);
		await deleteObject(urlRef);
	};

	const deleteAccount = async () => {
		const isDelete = window.confirm(
			`정말로 회원을 탈퇴하시겠습니까?\n회원 탈퇴시 그동안의 데이터도 모두 삭제됩니다.`
		);
		if (isDelete) {
			try {
				deletePaperData();
				deleteProfileImgData();
				alert(
					`회원 탈퇴 되었습니다!\n\n그동안 Rolling-Rolling을 애용해주셔서 감사합니다 :)\n필요할 땐 언제든 다시 찾아주세요♡`
				);
				navigate("/", { replace: true });
			} catch (error) {
				alert(error.message);
			} finally {
				const user = authService.currentUser;
				await deleteUser(user);
			}
		}
	};

	return (
		<div>
			<img src={`${userObj.photoURL}`} width="100px" alt="profileImage" />
			<h2>{userObj.displayName}</h2>
			<EditProfile refreshUser={refreshUser} />
			<button onClick={onLogoutClick}>로그아웃</button>
			<button onClick={deleteAccount}>회원 탈퇴</button>
		</div>
	);
}

export default Profile;
