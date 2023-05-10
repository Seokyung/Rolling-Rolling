import React, { useRef } from "react";
import imageCompression from "browser-image-compression";

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
		<div>
			<label htmlFor="msgImgInput">
				<span>이미지 첨부</span>
			</label>
			<input
				type="file"
				id="msgImgInput"
				ref={imgInputRef}
				onChange={onMsgImgChange}
				accept="image/*"
				style={{ display: "none" }}
			/>
			{msgImg && (
				<div>
					<img src={msgImg} width="200px" alt="messageImage" />
					<button onClick={clearMsgImg}>이미지 제거하기</button>
				</div>
			)}
		</div>
	);
}

export default MessageImage;
