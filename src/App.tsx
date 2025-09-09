import { useState } from "react";
import Canvas from "./components/Canvas";
import Preview from "./components/Preview";
import axios from "axios";

function App() {
	const [html, setHtml] = useState("");
	const [css, setCss] = useState("");

	const handleExport = async (drawing: { png: string; svg: string }) => {
		const res = await axios.post("http://localhost:4000/api/generate/from-drawing", drawing);
		setHtml(res.data.html);
		setCss(res.data.css);
	};

	const handlePrompt = async () => {
		const prompt = window.prompt("Describe your website:");
		if (!prompt) return;
		const res = await axios.post("http://localhost:4000/api/generate/from-prompt", { prompt });
		setHtml(res.data.html);
		setCss(res.data.css);
	};

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-2xl font-bold">No-Code Website Builder (MVP)</h1>
			<Canvas onExport={handleExport} />
			<button onClick={handlePrompt} className="px-3 py-1 bg-green-500 text-white rounded">
				Generate from Prompt
			</button>
			<Preview html={html} css={css} />
		</div>
	);
}

export default App;
