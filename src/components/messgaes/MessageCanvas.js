import React, { useEffect, useRef, useState } from "react";

function MessageCanvas({ setMsgDrawing, setCanvasModal }) {
	const canvasRef = useRef(null);
	const [ctx, setCtx] = useState(null);
	const [isDrawing, setIsDrawing] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		canvas.width = window.innerWidth * 0.6;
		canvas.height = window.innerHeight * 0.6;
		const getCtx = canvas.getContext("2d");
		setCtx(getCtx);
	}, []);

	const onDrawing = (e) => {
		const mouseX = e.nativeEvent.offsetX;
		const mouseY = e.nativeEvent.offsetY;
		if (isDrawing) {
			ctx.lineTo(mouseX, mouseY);
			ctx.stroke();
		} else {
			ctx.beginPath();
			ctx.moveTo(mouseX, mouseY);
		}
	};

	const resetDrawing = () => {
		ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
	};

	const saveDrawing = () => {
		const drawingUrl = canvasRef.current.toDataURL("image/png");
		setMsgDrawing(drawingUrl);
		setCanvasModal((prev) => !prev);
	};

	return (
		<div>
			<h4>Canvas</h4>
			<canvas
				ref={canvasRef}
				onMouseDown={() => setIsDrawing(true)}
				onMouseUp={() => setIsDrawing(false)}
				onMouseMove={(e) => onDrawing(e)}
				onMouseLeave={() => setIsDrawing(false)}
				style={{ backgroundColor: "yellow" }}
			/>
			<button onClick={resetDrawing}>그림 지우기</button>
			<button onClick={saveDrawing}>그림 첨부하기</button>
		</div>
	);
}

export default MessageCanvas;
