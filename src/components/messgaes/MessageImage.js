import React, { useRef } from "react";
import imageCompression from "browser-image-compression";

import { Form, Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";

function MessageImage({ msgImg, setMsgImg, setAttachment }) {
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
		setAttachment("");
	};

	return (
		<>
			<div>
				{msgImg && (
					<div>
						<img src={msgImg} width="200px" alt="messageImage" />
						<button
							onClick={(e) => {
								e.preventDefault();
								clearMsgImg();
							}}
						>
							이미지 제거하기
						</button>
					</div>
				)}
				<label htmlFor="msgImgInput">
					<div>
						<div className="msgImg-upload-container">
							<PlusOutlined />
							사진 업로드
						</div>
					</div>
				</label>
				<input
					type="file"
					id="msgImgInput"
					ref={imgInputRef}
					onChange={onMsgImgChange}
					accept="image/*"
					style={{ display: "none" }}
				/>
				<button onClick={clearMsgImg}>X</button>
			</div>
			{/* <Form.Group className="createMessage-button-group">
				<Form.Label>이미지 첨부</Form.Label>
				<Form.Control
					type="file"
					id="msgImgInput"
					ref={imgInputRef}
					onChange={onMsgImgChange}
					accept="image/*"
				/>
			</Form.Group> */}
			{/* <Upload
				action="/upload.do"
				listType="picture-card"
				id="msgImgInput"
				ref={imgInputRef}
				onChange={onMsgImgChange}
				accept="image/*"
			>
				<div>
					<PlusOutlined />
					<div className="msgImg-upload-container">사진 업로드</div>
				</div>
			</Upload> */}
		</>
	);
}

export default MessageImage;
