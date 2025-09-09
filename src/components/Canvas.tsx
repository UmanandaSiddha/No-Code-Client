import React, { useRef, useState } from "react";
import { Stage, Layer, Line, Rect, Circle } from "react-konva";

interface Stroke {
    tool: string;
    points: number[];
}

interface Shape {
    type: "rect" | "circle";
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
}

const tools = ["pen", "line", "rect", "circle", "eraser"];

const Canvas: React.FC<{ onExport: (data: { png: string; svg: string }) => void }> = ({ onExport }) => {
    const [tool, setTool] = useState<string>("pen");
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const isDrawing = useRef(false);
    const stageRef = useRef<any>(null);

    const handleMouseDown = () => {
        const pos = stageRef.current.getPointerPosition();
        isDrawing.current = true;

        if (tool === "pen" || tool === "line") {
            setStrokes([...strokes, { tool, points: [pos.x, pos.y] }]);
        } else if (tool === "rect") {
            setShapes([...shapes, { type: "rect", x: pos.x, y: pos.y, width: 100, height: 60 }]);
        } else if (tool === "circle") {
            setShapes([...shapes, { type: "circle", x: pos.x, y: pos.y, radius: 40 }]);
        }
    };

    const handleMouseMove = () => {
        if (!isDrawing.current) return;
        const stage = stageRef.current;
        const point = stage.getPointerPosition();

        if (tool === "pen" || tool === "line") {
            const lastStroke = strokes[strokes.length - 1];
            lastStroke.points = lastStroke.points.concat([point.x, point.y]);
            strokes.splice(strokes.length - 1, 1, lastStroke);
            setStrokes(strokes.concat());
        }
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const exportDrawing = () => {
        if (!stageRef.current) return;

        const png = stageRef.current.toDataURL({
            mimeType: "image/png",
            pixelRatio: 2,
            backgroundColor: "white",
        });

        const svgPaths = strokes
            .map(
                (s) =>
                    `<path d="M ${s.points
                        .map((p, i) => (i % 2 === 0 ? `${p},` : `${p} `))
                        .join("")}" stroke="black" fill="none" stroke-width="2"/>`
            )
            .join("\n");

        const svgShapes = shapes
            .map((sh) => {
                if (sh.type === "rect") {
                    return `<rect x="${sh.x}" y="${sh.y}" width="${sh.width}" height="${sh.height}" stroke="black" fill="transparent"/>`;
                } else if (sh.type === "circle") {
                    return `<circle cx="${sh.x}" cy="${sh.y}" r="${sh.radius}" stroke="black" fill="transparent"/>`;
                }
                return "";
            })
            .join("\n");

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${svgPaths}${svgShapes}</svg>`;

        onExport({ png, svg });
    };

    return (
        <div className="w-full h-screen flex flex-col">
            {/* Toolbar */}
            <div className="flex space-x-2 p-2 bg-gray-100 border-b">
                {tools.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTool(t)}
                        className={`px-3 py-1 rounded ${tool === t ? "bg-blue-500 text-white" : "bg-white border"}`}
                    >
                        {t}
                    </button>
                ))}
                <button
                    onClick={exportDrawing}
                    className="ml-auto px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Export
                </button>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-white">
                <Stage
                    width={window.innerWidth}
                    height={window.innerHeight - 50}
                    onMouseDown={handleMouseDown}
                    onMousemove={handleMouseMove}
                    onMouseup={handleMouseUp}
                    ref={stageRef}
                    className="bg-white border"
                >
                    <Layer>
                        <Rect width={800} height={600} fill="white" />
                        {shapes.map((sh, i) =>
                            sh.type === "rect" ? (
                                <Rect key={i} x={sh.x} y={sh.y} width={sh.width} height={sh.height} stroke="black" />
                            ) : (
                                <Circle key={i} x={sh.x} y={sh.y} radius={sh.radius} stroke="black" />
                            )
                        )}
                        {strokes.map((s, i) => (
                            <Line
                                key={i}
                                points={s.points}
                                stroke={s.tool === "eraser" ? "white" : "black"}
                                strokeWidth={s.tool === "eraser" ? 10 : 2}
                                tension={0.5}
                                lineCap="round"
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default Canvas;