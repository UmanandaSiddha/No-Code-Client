import { useState } from "react";
import Canvas from "./components/Canvas";
import Preview from "./components/Preview";
import axios from "axios";

function App() {
	const [html, setHtml] = useState("");
	const [css, setCss] = useState("");
	const [loading, setLoading] = useState(false);

	// --- Common handler for both drawing and prompt ---
	const handleGenerate = async (payload: any, mode: "drawing" | "prompt") => {
		setLoading(true);
		try {
			const url =
				mode === "drawing"
					? "http://localhost:4000/api/generate/from-drawing"
					: "http://localhost:4000/api/generate/from-prompt";

			const res = await axios.post(url, payload);
			console.log(res);

			// Update preview
			setHtml(res.data.parsed.html || "");
			setCss(res.data.parsed.css || "");
		} catch (err) {
			console.error("Generation failed:", err);
			alert("Something went wrong. Check the backend logs.");
		} finally {
			setLoading(false);
		}
	};

	// Called by Canvas export
	const handleExport = (drawing: { png: string; svg: string }) => {
		handleGenerate(
			{
				imageBase64: drawing.png.split(",")[1], // strip "data:image/png;base64,"
				prompt: `You are a website code generator. 
        Task: Convert this sketch into a clean, semantic webpage.
        Output JSON with keys { html, css } only.
        html: full <div>... markup
        css: stylesheet for layout, colors, typography.
        Ensure HTML uses only plain HTML5 tags (no JS).`,
			},
			"drawing"
		);
	};

	// Triggered by user entering a prompt
	const handlePrompt = async () => {
		const prompt = window.prompt("Describe your website:");
		if (!prompt) return;
		handleGenerate(
			{
				prompt: `You are a website code generator. 
        Task: Generate a clean, semantic webpage from this description: "${prompt}".
        Output JSON with keys { html, css } only.
        html: full <div>... markup
        css: stylesheet for layout, colors, typography.
        Ensure HTML uses only plain HTML5 tags (no JS).`,
			},
			"prompt"
		);
	};

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-2xl font-bold">No-Code Website Builder (MVP)</h1>
			<Canvas onExport={handleExport} />
			<button
				onClick={handlePrompt}
				className="px-3 py-1 bg-green-500 text-white rounded"
				disabled={loading}
			>
				{loading ? "Generating..." : "Generate from Prompt"}
			</button>
			<Preview html={html} css={css} />
		</div>
	);
}

export default App;
