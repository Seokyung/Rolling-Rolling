import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditProfile from "components/user/EditProfile";
import LogOutModal from "components/user/LogOutModal";
import DeleteUser from "components/user/DeleteUser";

import { Button } from "react-bootstrap";
import { Row, Col, Image } from "antd";
import "./Profile.css";

function Profile({ refreshUser }) {
	const userObj = useSelector((state) => state.userReducer);

	const [logOutModal, setLogOutModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);

	const openLogOutModal = () => {
		setLogOutModal(true);
	};

	const openDeleteModal = () => {
		setDeleteModal(true);
	};

	return (
		<>
			<div className="profile-container">
				<div className="home-paper-container">
					<Row className="profile-row">
						<Col span={24} lg={8} className="profile-info-container">
							<div className="profile-img-container">
								<Image
									className="profile-img"
									src={`${userObj.photoURL}`}
									alt="profileImage"
								/>
							</div>
							<h2 className="profile-username">{userObj.displayName}</h2>
						</Col>
						<Col span={24} lg={16} className="profile-edit-container">
							<EditProfile
								refreshUser={refreshUser}
								openLogOutModal={openLogOutModal}
								openDeleteModal={openDeleteModal}
							/>
						</Col>
					</Row>
				</div>
			</div>

			<LogOutModal logOutModal={logOutModal} setLogOutModal={setLogOutModal} />
			<DeleteUser deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
		</>
	);
}

export default Profile;
