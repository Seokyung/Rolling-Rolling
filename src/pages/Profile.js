import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditProfile from "components/user/EditProfile";
import LogOutModal from "components/user/LogOutModal";
import DeleteUser from "components/user/DeleteUser";

import { Row, Col, Image, message } from "antd";
import "./Profile.css";

function Profile({ refreshUser }) {
	const userObj = useSelector((state) => state.userReducer);

	const [logOutModal, setLogOutModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);

	const [messageApi, contextHolder] = message.useMessage();

	const openLogOutModal = () => {
		setLogOutModal(true);
	};

	const openDeleteModal = () => {
		setDeleteModal(true);
	};

	return (
		<>
			{contextHolder}
			<div className="profile-container">
				<div className="home-paper-container">
					<Row className="profile-row">
						<Col span={24} md={9} className="profile-info-container">
							<div className="profile-img-wrapper">
								<div className="profile-img-container">
									<Image
										className="profile-img"
										src={`${userObj.photoURL}`}
										alt="profileImage"
									/>
								</div>
							</div>
							<h4 className="profile-username">{userObj.displayName}</h4>
						</Col>
						<Col span={24} md={15} className="profile-edit-container">
							<EditProfile
								refreshUser={refreshUser}
								openLogOutModal={openLogOutModal}
								openDeleteModal={openDeleteModal}
							/>
						</Col>
					</Row>
				</div>
			</div>

			<LogOutModal
				logOutModal={logOutModal}
				setLogOutModal={setLogOutModal}
				messageApi={messageApi}
			/>
			<DeleteUser deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
		</>
	);
}

export default Profile;
