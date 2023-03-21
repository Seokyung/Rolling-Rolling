import React from "react";

function Message({ msgObj }) {
	return (
		<div>
			<h3>{msgObj.msgTitle}</h3>
			<h4>{msgObj.msgWriter}</h4>
			<p>{msgObj.msgContent}</p>
		</div>
	);
}

export default Message;
