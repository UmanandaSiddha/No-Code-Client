import React, { useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";

interface Stroke {
    tool: string;
    points: number[];
}

const Canvas: React.FC<{ onExport: (data: { png: string; svg: string }) => void }> = ({ onExport }) => {
    const [tool] = useState("pen");
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const isDrawing = useRef(false);
    const stageRef = useRef<any>(null);

    const handleMouseDown = () => {
        isDrawing.current = true;
        const pos = stageRef.current.getPointerPosition();
        setStrokes([...strokes, { tool, points: [pos.x, pos.y] }]);
    };

    const handleMouseMove = () => {
        if (!isDrawing.current) return;
        const stage = stageRef.current;
        const point = stage.getPointerPosition();
        const lastStroke = strokes[strokes.length - 1];
        lastStroke.points = lastStroke.points.concat([point.x, point.y]);
        strokes.splice(strokes.length - 1, 1, lastStroke);
        setStrokes(strokes.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const exportDrawing = () => {
        if (!stageRef.current) return;
        // Export PNG
        const png = stageRef.current.toDataURL({ mimeType: "image/png" });

        // Export SVG (basic path conversion)
        const svgPaths = strokes
            .map(
                (s) =>
                    `<path d="M ${s.points
                        .map((p, i) => (i % 2 === 0 ? `${p},` : `${p} `))
                        .join("")}" stroke="black" fill="none" stroke-width="2"/>`
            )
            .join("\n");

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">${svgPaths}</svg>`;
        onExport({ png, svg });
    };

    return (
        <div className="border p-2 rounded">
            <Stage
                width={800}
                height={600}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                ref={stageRef}
                className="bg-white border"
            >
                <Layer>
                    {strokes.map((s, i) => (
                        <Line key={i} points={s.points} stroke="black" strokeWidth={2} tension={0.5} lineCap="round" />
                    ))}
                </Layer>
            </Stage>
            <button
                onClick={exportDrawing}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Export Drawing
            </button>
        </div>
    );
};

export default Canvas;
