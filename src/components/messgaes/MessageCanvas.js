import React, { useEffect, useRef, useState } from "react";

function MessageCanvas({ setMsgDrawing, setCanvasModal }) {
	const canvasRef = useRef(null);
	const [ctx, setCtx] = useState(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [tool, setTool] = useState("pen");
	const [toolWidth, setToolWidth] = useState("1");
	const [color, setColor] = useState("black");
	//const [drawArray, setDrawArray] = useState([]);
	//let drawArray = [];
	//const [idx, setIdx] = useState(-1);

	useEffect(() => {
		const canvas = canvasRef.current;
		canvas.width = window.innerWidth * 0.6;
		canvas.height = window.innerHeight * 0.6;
		const getCtx = canvas.getContext("2d");
		setCtx(getCtx);
		//setIdx(-1);
	}, []);

	const onDrawing = (e) => {
		const mouseX = e.nativeEvent.offsetX;
		const mouseY = e.nativeEvent.offsetY;
		ctx.lineJoin = "round";
		ctx.lineWidth = toolWidth;
		if (isDrawing) {
			ctx.lineTo(mouseX, mouseY);
			ctx.stroke();
		} else {
			ctx.beginPath();
			ctx.moveTo(mouseX, mouseY);
		}
	};

	const onHandleMouseDown = (e) => {
		setIsDrawing(false);
		const mouseX = e.nativeEvent.offsetX;
		const mouseY = e.nativeEvent.offsetY;
		ctx.beginPath();
		ctx.moveTo(mouseX, mouseY);
		// if (e.type !== "mouseout") {
		// 	drawArray.push(
		// 		ctx.getImageData(
		// 			0,
		// 			0,
		// 			canvasRef.current.width,
		// 			canvasRef.current.height
		// 		)
		// 	);
		// 	setIdx((prev) => prev + 1);
		// 	console.log(idx, ": ", drawArray[idx]);
		// }
	};

	const undoLastStroke = () => {
		// if (idx <= 0) {
		// 	resetDrawing();
		// } else {
		// 	setIdx((prev) => prev - 1);
		// 	drawArray.pop();
		// 	console.log(drawArray[idx]);
		// 	ctx.putImageData(drawArray[idx], 0, 0);
		// }
	};

	const onToolChange = (e) => {
		const {
			target: { value },
		} = e;
		setTool(value);
		if (value === "pen") {
			ctx.strokeStyle = color;
		} else if (value === "eraser") {
			ctx.strokeStyle = "white";
		}
	};

	const onToolWidthChange = (e) => {
		const {
			target: { value },
		} = e;
		setToolWidth(value);
		ctx.lineWidth = value;
	};

	const onColorChange = (e) => {
		const {
			target: { value },
		} = e;
		setColor(value);
		ctx.strokeStyle = value;
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
				onMouseUp={onHandleMouseDown}
				onMouseMove={(e) => onDrawing(e)}
				onMouseLeave={() => setIsDrawing(false)}
				style={{ border: "1px solid black" }}
			/>
			<div>
				<div>
					<label>
						<input
							type="radio"
							name="toolType"
							id="pen"
							value="pen"
							checked={tool === "pen"}
							onChange={onToolChange}
						/>
						펜
					</label>
					<label>
						<input
							type="radio"
							name="toolType"
							id="eraser"
							value="eraser"
							checked={tool === "eraser"}
							onChange={onToolChange}
						/>
						지우개
					</label>
				</div>
				<label>
					펜 두께
					<input
						type="range"
						id="toolWidth"
						min="1"
						max="25"
						step="2"
						value={toolWidth}
						onChange={onToolWidthChange}
					/>
				</label>
				<div>
					<label>
						<input
							type="radio"
							name="penColor"
							id="black"
							value="black"
							checked={color === "black"}
							onChange={onColorChange}
						/>
						검정
					</label>
					<label>
						<input
							type="radio"
							name="penColor"
							id="red"
							value="red"
							checked={color === "red"}
							onChange={onColorChange}
						/>
						빨강
					</label>
					<label>
						<input
							type="radio"
							name="penColor"
							id="yellow"
							value="yellow"
							checked={color === "yellow"}
							onChange={onColorChange}
						/>
						노랑
					</label>
					<label>
						<input
							type="radio"
							name="penColor"
							id="green"
							value="green"
							checked={color === "green"}
							onChange={onColorChange}
						/>
						초록
					</label>
					<label>
						<input
							type="radio"
							name="penColor"
							id="blue"
							value="blue"
							checked={color === "blue"}
							onChange={onColorChange}
						/>
						파랑
					</label>
				</div>
				<button onClick={undoLastStroke}>되돌리기</button>
				<button onClick={resetDrawing}>리셋</button>
			</div>
			<button onClick={saveDrawing}>그림 첨부하기</button>
		</div>
	);
}

export default MessageCanvas;
