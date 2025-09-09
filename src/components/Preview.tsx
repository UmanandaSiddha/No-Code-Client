// frontend/src/components/Preview.tsx
import React, { useEffect, useRef } from "react";

interface PreviewProps {
    html: string;
    css: string;
}

const Preview: React.FC<PreviewProps> = ({ html, css }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                doc.open();
                doc.write(`
                <html><head><style>${css}</style></head>
                <body>${html}</body></html>
                `);
                doc.close();
            }
        }
    }, [html, css]);

    return <iframe ref={iframeRef} className="w-full h-[400px] border rounded" sandbox="allow-same-origin" />;
};

export default Preview;
