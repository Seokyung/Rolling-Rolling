import React, { useRef } from "react";
import imageCompression from "browser-image-compression";

import { Button as CircleBtn, Image } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faInbox } from "@fortawesome/free-solid-svg-icons";
import "./MessageImage.css";

function MessageImage({ msgImg, setMsgImg, closeAttach }) {
	const imgInputRef = useRef(null);

	const onMsgImgChange = async (e) => {
		const {
			target: { files },
		} = e;
		const imgFile = files[0];
		try {
			const compressedImg = await imageCompression(imgFile, { maxSizeMB: 0.5 });
			const promise = imageCompression.getDataUrlFromFile(compressedImg);
			promise.then((result) => {
				setMsgImg(result);
			});
		} catch (error) {
			console.log(error);
		}
	};

	const clearMsgImg = () => {
		imgInputRef.current.value = null;
		setMsgImg("");
	};

	const closeMsgImg = () => {
		imgInputRef.current.value = null;
		closeAttach();
	};

	return (
		<>
			<div className="msgImg-wrapper">
				{msgImg ? (
					<div className="msgImg-container">
						<div className="msgImg-img-container">
							<Image src={msgImg} className="msgImg-img" alt="messageImage" />
							<CircleBtn
								shape="circle"
								className="upload-close-btn img-close"
								onClick={clearMsgImg}
							>
								<FontAwesomeIcon icon={faXmark} />
							</CircleBtn>
						</div>
					</div>
				) : (
					<div className="msgImg-container">
						<label htmlFor="msgImgInput">
							<div className="msgImg-upload-container">
								<FontAwesomeIcon icon={faInbox} />
								첨부할 이미지를 선택해주세요
							</div>
						</label>
						<CircleBtn
							shape="circle"
							className="upload-close-btn file-close"
							onClick={closeMsgImg}
						>
							<FontAwesomeIcon icon={faXmark} />
						</CircleBtn>
					</div>
				)}
				<input
					type="file"
					id="msgImgInput"
					ref={imgInputRef}
					onChange={onMsgImgChange}
					accept="image/*"
					style={{ display: "none" }}
				/>
			</div>
		</>
	);
}

export default MessageImage;
