import React from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "fbase";
import { signOut, deleteUser } from "firebase/auth";
import {
	doc,
	onSnapshot,
	deleteDoc,
	query,
	collection,
	getDocs,
	where,
} from "firebase/firestore";
import EditProfile from "components/profile/EditProfile";

function Profile({ userObj, refreshUser }) {
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
					await deleteDoc(msgRef);
				});
				const paperRef = doc(dbService, "papers", `${paper.id}`);
				await deleteDoc(paperRef);
			});
		} catch (error) {
			console.log(error.message);
		} finally {
			navigate("/", { replace: true });
		}
	};

	const deleteAccount = async () => {
		const isDelete = window.confirm(
			`정말로 회원을 탈퇴하시겠습니까?\n회원 탈퇴시 그동안의 데이터도 모두 삭제됩니다.`
		);
		if (isDelete) {
			try {
				deletePaperData();
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
			<img src={`${userObj.photoURL}`} width="100px" />
			<h2>{userObj.displayName}</h2>
			<EditProfile userObj={userObj} refreshUser={refreshUser} />
			<button onClick={onLogoutClick}>로그아웃</button>
			<button onClick={deleteAccount}>회원 탈퇴</button>
		</div>
	);
}

export default Profile;
