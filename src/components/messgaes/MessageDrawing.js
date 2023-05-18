import React, { useEffect, useRef, useState } from "react";

import { Modal, Form, Button, CloseButton } from "react-bootstrap";
import { Row, Col, Slider, InputNumber, Divider } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPen,
	faEraser,
	faArrowLeft,
	faRotateLeft,
	faCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./MessageDrawing.css";

function MessageDrawing({
	canvasModal,
	setCanvasModal,
	setMsgDrawing,
	setAttachment,
}) {
	const canvasRef = useRef(null);
	const [ctx, setCtx] = useState(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [tool, setTool] = useState("pen");
	const [toolWidth, setToolWidth] = useState("1");
	const [color, setColor] = useState("black");
	const [drawArray, setDrawArray] = useState([]);
	const [idx, setIdx] = useState(0);

	const [customColor, setCustomColor] = useState("#000000");

	const colorPalette = [
		{ id: 0, color: "black", name: "검정" },
		{ id: 1, color: "red", name: "빨강" },
		{ id: 2, color: "yellow", name: "노랑" },
		{ id: 3, color: "green", name: "초록" },
		{ id: 4, color: "blue", name: "파랑" },
	];

	useEffect(() => {
		const canvas = canvasRef.current;
		const getCtx = canvas.getContext("2d", { willReadFrequently: true });

		if (
			canvas.clientWidth !== canvas.width ||
			canvas.clientHeight !== canvas.height
		) {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
		}

		setCtx(getCtx);
		// setTool("pen");
		// setToolWidth("1");
		// setColor("black");
		// setDrawArray([]);
		// setIdx(0);
	}, []);

	const closeCanvasModal = () => {
		setCanvasModal(false);
		setAttachment("");
	};

	const getPosMouse = (e) => {
		return {
			x: parseInt(e.nativeEvent.offsetX),
			y: parseInt(e.nativeEvent.offsetY),
		};
	};

	const getPosTouch = (e) => {
		return {
			x: parseInt(e.touches[0].clientX),
			y: parseInt(e.touches[0].clientY),
		};

		// Touch Event
		// const getX = e.touches[0].clientX - e.target.offsetLeft;
		// const getY =
		// 	e.touches[0].clientY -
		// 	e.target.offsetTop +
		// 	document.documentElement.scrollTop;
	};

	const startDrawing = (e, type) => {
		// if (e.cancelable) {
		// 	e.preventDefault();
		// }
		// window.addEventListener(
		// 	"touchstart",
		// 	function () {
		// 		e.nativeEvent.preventDefault();
		// 	},
		// 	{ passive: false }
		// ); // for scroll lock in Mobile

		let getX, getY;

		if (type === "mouse") {
			const { x, y } = getPosMouse(e);
			getX = x;
			getY = y;
		}
		if (type === "touch") {
			const { x, y } = getPosTouch(e);
			getX = x;
			getY = y;
		}

		setIsDrawing(true);
		ctx.beginPath();
		ctx.moveTo(getX, getY);

		if (e.type !== "mouseout") {
			setDrawArray(
				drawArray.concat({
					id: idx,
					imgData: ctx.getImageData(
						0,
						0,
						canvasRef.current.width,
						canvasRef.current.height
					),
				})
			);
			setIdx((prev) => prev + 1);
		}
	};

	const onDrawing = (e, type) => {
		// window.addEventListener(
		// 	"touchmove",
		// 	function () {
		// 		e.nativeEvent.preventDefault();
		// 	},
		// 	{ passive: false }
		// ); // for scroll lock in Mobile

		let getX, getY;

		if (type === "mouse") {
			const { x, y } = getPosMouse(e);
			getX = x;
			getY = y;
		}
		if (type === "touch") {
			const { x, y } = getPosTouch(e);
			getX = x;
			getY = y;
		}

		if (isDrawing) {
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.lineWidth = toolWidth;

			if (tool === "pen") {
				ctx.lineTo(getX, getY);
				ctx.stroke();
			} else if (tool === "eraser") {
				ctx.clearRect(
					getX - toolWidth / 2,
					getY - toolWidth / 2,
					toolWidth,
					toolWidth
				);
			}
		}
	};

	const stopDrawing = (e) => {
		if (isDrawing) {
			ctx.stroke();
			ctx.closePath();
			setIsDrawing(false);
		}
		e.preventDefault();
	};

	const onToolChange = (e) => {
		const {
			target: { value },
		} = e;
		setTool(value);
	};

	const onToolWidthChange = (e) => {
		// const {
		// 	target: { value },
		// } = e;
		// setToolWidth(value);
		// ctx.lineWidth = value;
		setToolWidth(e);
		ctx.lineWidth = e;
	};

	const onColorChange = (e) => {
		const {
			target: { value },
		} = e;
		setColor(value);
		ctx.strokeStyle = value;
	};

	const onCustomColorChange = (e) => {
		const {
			target: { value },
		} = e;
		setColor(value);
		setCustomColor(value);
		ctx.strokeStyle = value;
	};

	const undoLastDrawing = () => {
		if (idx <= 0) {
			resetDrawing();
		} else {
			setIdx((prev) => prev - 1);
			const undoArray = drawArray.filter((data) => data.id !== idx);
			setDrawArray(undoArray);
			const getArray = drawArray.find((data) => data.id === idx - 1);
			ctx.putImageData(getArray.imgData, 0, 0);
		}
	};

	const resetDrawing = () => {
		setDrawArray([]);
		setIdx(0);
		ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
	};

	const saveDrawing = () => {
		const drawingUrl = canvasRef.current.toDataURL("image/png");
		setMsgDrawing(drawingUrl);
		setCanvasModal(false);
	};

	const renderColorPalette = () => {
		return colorPalette.map((pen) => {
			return (
				<div key={pen.id}>
					<input
						className="msgDrawing-radio-btn"
						type="radio"
						name="penColor"
						id={pen.color}
						value={pen.color}
						checked={color === pen.color}
						onChange={onColorChange}
					/>
					<label
						className="msgDrawing-color-label"
						htmlFor={pen.color}
						id={`pen-${pen.color}`}
					>
						<FontAwesomeIcon icon={faCircle} />
					</label>
				</div>
			);
		});
	};

	return (
		<Modal
			show={canvasModal}
			onExit={closeCanvasModal}
			centered
			animation={true}
			keyboard={false}
			backdrop="static"
		>
			<Modal.Header className="create-modal-header">
				<Modal.Title className="create-modal-title">그림 그리기</Modal.Title>
				<CloseButton className="modal-close-btn" onClick={closeCanvasModal} />
			</Modal.Header>
			<Modal.Body className="msgDrawing-container">
				<canvas
					className="msgDrawing-canvas"
					ref={canvasRef}
					onMouseDown={(e) => startDrawing(e, "mouse")}
					onTouchStart={(e) => startDrawing(e, "touch")}
					onMouseMove={(e) => onDrawing(e, "mouse")}
					onTouchMove={(e) => onDrawing(e, "touch")}
					onMouseUp={stopDrawing}
					onMouseOut={stopDrawing}
					onTouchEnd={stopDrawing}
				/>
				<div></div>
				<Row
					className="msgDrawing-tool-container"
					align="middle"
					justify="center"
				>
					<Col className="msgDrawing-tool-group">
						<input
							className="msgDrawing-radio-btn"
							type="radio"
							name="toolType"
							id="pen"
							value="pen"
							checked={tool === "pen"}
							onChange={onToolChange}
						/>
						<label htmlFor="pen" className="msgDrawing-tool-label">
							<FontAwesomeIcon icon={faPen} />
						</label>
						<input
							className="msgDrawing-radio-btn"
							type="radio"
							name="toolType"
							id="eraser"
							value="eraser"
							checked={tool === "eraser"}
							onChange={onToolChange}
						/>
						<label htmlFor="eraser" className="msgDrawing-tool-label">
							<FontAwesomeIcon icon={faEraser} />
						</label>
					</Col>
					<Divider type="vertical" className="tool-divider" />
					<Col className="msgDrawing-tool-group">
						<div className="msgDrawing-color-container">
							{renderColorPalette()}
							<input
								className="msgDrawing-radio-btn"
								type="radio"
								name="penColor"
								id={customColor}
								value={customColor}
								checked={color === customColor}
								onChange={onColorChange}
							/>
							<Form.Control
								className="msgDrawing-radio-colorPicker"
								type="color"
								id="customColor"
								value={customColor}
								onChange={onCustomColorChange}
							/>
						</div>
					</Col>
					<Divider type="vertical" className="tool-divider" />
					<Col className="msgDrawing-tool-group">
						<Row>
							<Col>
								<Slider
									className="msgDrawing-slider"
									id="toolWidth"
									min={1}
									max={100}
									value={toolWidth}
									onChange={onToolWidthChange}
								/>
							</Col>
							<Col>
								<InputNumber
									className="msgDrawing-slider-number"
									min={1}
									max={100}
									value={toolWidth}
									onChange={onToolWidthChange}
								/>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row align="middle" justify="center">
					<Col className="msgDrawing-tool-group">
						<Button onClick={undoLastDrawing}>
							<FontAwesomeIcon icon={faArrowLeft} />
						</Button>
						<Button onClick={resetDrawing}>
							<FontAwesomeIcon icon={faRotateLeft} />
						</Button>
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer className="create-modal-footer">
				<Button id="create-btn" size="lg" onClick={saveDrawing}>
					그림 첨부하기
				</Button>
				<Button
					id="close-btn"
					variant="outline-secondary"
					size="lg"
					onClick={closeCanvasModal}
				>
					닫기
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default MessageDrawing;
