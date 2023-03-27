import React, { useEffect, useRef, useState } from "react";

function MessageCanvas() {
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
		if (!isDrawing) {
			ctx.beginPath();
			ctx.moveTo(mouseX, mouseY);
		} else {
			ctx.lineTo(mouseX, mouseY);
			ctx.stroke();
		}
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
		</div>
	);
}

export default MessageCanvas;
