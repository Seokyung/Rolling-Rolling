import React, { useEffect, useRef, useState } from "react";
import useDebounce from "modules/useDebounce";

import { Modal, Form, Button, CloseButton } from "react-bootstrap";
import { Row, Col, Slider, InputNumber, Divider, Tooltip, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPaintbrush,
	faEraser,
	faRotateLeft,
	faShare,
	faCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./MessageDrawing.css";

function MessageDrawing({ canvasModal, setCanvasModal, setMsgDrawing }) {
	const canvasRef = useRef(null);
	const [ctx, setCtx] = useState(null);
	const [canvasWidth, setCanvasWidth] = useState(0);
	const [canvasHeight, setCanvasHeight] = useState(0);
	const [isDrawing, setIsDrawing] = useState(false);
	const [tool, setTool] = useState("pen");
	const [toolWidth, setToolWidth] = useState(1);
	const [color, setColor] = useState("black");

	const debouncedCanvasWidth = useDebounce(canvasWidth, 500);
	const debouncedCanvasHeight = useDebounce(canvasHeight, 500);

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

	const [messageApi, contextHolder] = message.useMessage();
	const key = "updatable";

	useEffect(() => {
		const canvas = canvasRef.current;
		const getCtx = canvas.getContext("2d", { willReadFrequently: true });

		if (
			canvas.clientWidth !== canvas.width ||
			canvas.clientHeight !== canvas.height
		) {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
			setCanvasWidth(canvas.clientWidth);
			setCanvasHeight(canvas.clientHeight);
		}

		setCtx(getCtx);

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleResize = () => {
		const canvas = canvasRef.current;
		if (
			canvas.clientWidth !== canvas.width ||
			canvas.clientHeight !== canvas.height
		) {
			const tmpCanvas = document.createElement("canvas");
			tmpCanvas.width = canvas.width;
			tmpCanvas.height = canvas.height;
			const tmpCtx = tmpCanvas.getContext("2d", { willReadFrequently: true });

			tmpCtx.drawImage(canvas, 0, 0);
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
			setCanvasWidth(canvas.width);
			setCanvasHeight(canvas.height);

			const getCtx = canvas.getContext("2d", { willReadFrequently: true });
			getCtx.drawImage(
				tmpCanvas,
				0,
				0,
				tmpCanvas.width,
				tmpCanvas.height,
				0,
				0,
				canvas.width,
				canvas.height
			);
			setCtx(getCtx);

			// 스크린 크기가 바뀔 때(resize) 원래 그림 조정 방법
			// 1. resize시 원래 그림이 canvas 비율에 맞춰 조정 (그림이 짜부되거나 넓어질 수 있음)
			/*
			const tmpCanvas = document.createElement("canvas");
			tmpCanvas.width = canvas.width;
			tmpCanvas.height = canvas.height;
			const tmpCtx = tmpCanvas.getContext("2d", { willReadFrequently: true });

			tmpCtx.drawImage(canvas, 0, 0);
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
			setCanvasWidth(canvas.width);
			setCanvasHeight(canvas.height);

			const getCtx = canvas.getContext("2d", { willReadFrequently: true });
			getCtx.drawImage(
				tmpCanvas,
				0,
				0,
				tmpCanvas.width,
				tmpCanvas.height,
				0,
				0,
				canvas.width,
				canvas.height
			);
			setCtx(getCtx);
			*/
			// 2. resize시 원래 그림 크기 조정 X, 보이는 부분만 살림 (그림이 잘릴 수 있음)
			/*
			const currentImgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
			setCanvasWidth(canvas.width);
			setCanvasHeight(canvas.height);

			ctx.putImageData(currentImgData, 0, 0);
			*/
		}
	};

	useEffect(() => {}, [
		canvasWidth,
		canvasHeight,
		debouncedCanvasWidth,
		debouncedCanvasHeight,
	]);

	const closeCanvasModal = () => {
		try {
			const scrollY = document.body.style.top;
			document.body.style.position = "";
			document.body.style.top = "";
			window.scrollTo(0, parseInt(scrollY || "0") * -1);
		} finally {
			setCanvasModal(false);
		}
	};

	const getPosMouse = (e) => {
		return {
			x: parseInt(e.nativeEvent.offsetX),
			y: parseInt(e.nativeEvent.offsetY),
		};
	};

	const getPosTouch = (e) => {
		const offset = e.target.getBoundingClientRect();
		return {
			x: parseInt(e.touches[0].clientX - offset.x),
			y: parseInt(e.touches[0].clientY - offset.y),
		};
	};

	const startDrawing = (e, type) => {
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
		ctx.strokeStyle = color;

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
		if (!isDrawing) {
			return;
		}

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
		if (!isDrawing) {
			return;
		}
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

	const changeToCustomColor = () => {
		setColor(customColor);
		ctx.strokeStyle = customColor;
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

	const saveDrawing = async () => {
		await messageApi.open({
			key,
			type: "loading",
			content: "그림 첨부중...",
			className: "alert-message-container",
			duration: 0.5,
		});

		const drawingUrl = canvasRef.current.toDataURL("image/png");
		setMsgDrawing(drawingUrl);
		closeCanvasModal();

		messageApi.open({
			key,
			type: "success",
			content: "그림이 첨부되었습니다!",
			className: "alert-message-container",
			duration: 2,
		});
	};

	const renderColorPalette = () => {
		return colorPalette.map((pen) => {
			return (
				<Col key={pen.id} className="msgDrawing-color-group">
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
				</Col>
			);
		});
	};

	return (
		<>
			{contextHolder}
			<Modal
				show={canvasModal}
				onExit={closeCanvasModal}
				centered
				animation={true}
				keyboard={false}
				scrollable={true}
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
					<Divider className="divider-margin" />
					<Row align="middle" justify="center" className="row-padding">
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
							{/* <Tooltip title="펜"> */}
							<label htmlFor="pen" className="msgDrawing-tool-label">
								<FontAwesomeIcon icon={faPaintbrush} />
							</label>
							{/* </Tooltip> */}
							<input
								className="msgDrawing-radio-btn"
								type="radio"
								name="toolType"
								id="eraser"
								value="eraser"
								checked={tool === "eraser"}
								onChange={onToolChange}
							/>
							{/* <Tooltip title="지우개"> */}
							<label htmlFor="eraser" className="msgDrawing-tool-label">
								<FontAwesomeIcon icon={faEraser} />
							</label>
							{/* </Tooltip> */}
						</Col>
						<Divider type="vertical" className="tool-divider" />
						<Col className="msgDrawing-tool-group">
							{/* <Tooltip title="하나 지우기"> */}
							<span
								className="msgDrawing-tool-undo-btn"
								onClick={undoLastDrawing}
							>
								<FontAwesomeIcon
									id="back-icon"
									icon={faShare}
									flip="horizontal"
								/>
							</span>
							{/* </Tooltip> */}
							{/* <Tooltip title="전부 지우기"> */}
							<span className="msgDrawing-tool-undo-btn" onClick={resetDrawing}>
								<FontAwesomeIcon icon={faRotateLeft} />
							</span>
							{/* </Tooltip> */}
						</Col>
					</Row>
					<Row align="middle" justify="center" className="colorPicker-margin">
						{renderColorPalette()}
						<Col className="msgDrawing-color-group">
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
								onClick={changeToCustomColor}
							/>
						</Col>
					</Row>
					<Row align="middle" justify="center" className="row-padding">
						<Col className="msgDrawing-slider-group">
							<Slider
								className="msgDrawing-slider"
								id="toolWidth"
								min={1}
								max={100}
								value={toolWidth}
								onChange={onToolWidthChange}
							/>
						</Col>
						<Col className="msgDrawing-slider-group">
							<InputNumber
								className="msgDrawing-slider-number"
								min={1}
								max={100}
								value={toolWidth}
								onChange={onToolWidthChange}
							/>
						</Col>
					</Row>
				</Modal.Body>
				<Modal.Footer className="create-modal-footer">
					<Button id="create-btn" onClick={saveDrawing}>
						그림 첨부하기
					</Button>
					<Button
						id="close-btn"
						variant="outline-secondary"
						onClick={closeCanvasModal}
					>
						닫기
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default MessageDrawing;
