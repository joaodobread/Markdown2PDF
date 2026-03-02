import {
  Code,
  Download,
  FileText,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast, Toaster } from "sonner";
import "./App.css";
import Mermaid from "./components/Mermaid";
import { PageBreak } from "./components/PageBreak";
import { WatermarkButton } from "./components/WatermarkButton";
import { WatermarkOverlay } from "./components/WatermarkOverlay";
import { DEFAULT_MARKDOWN } from "./constants/markdown-example";
import { useWatermark } from "./hooks/useWatermark";
import remarkPageBreak from "./plugins/remarkPageBreak";

type Theme = "light" | "dark";

function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("md-theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const { watermark, loadFromFile, remove: removeWatermark } = useWatermark();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("md-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const handlePrint = () => window.print();

  const handleMermaidError = (msg: string) => {
    toast.error(`Mermaid: ${msg}`, { duration: 5000 });
  };

  return (
    <div className="app-container">
      <header className="no-print">
        <div className="header-content">
          <div className="logo">
            <FileText size={22} />
            <h1>Markdown2PDF</h1>
          </div>
          <div className="header-actions">
            <WatermarkButton
              dataUrl={watermark.dataUrl}
              onLoad={loadFromFile}
              onRemove={removeWatermark}
            />
            <button
              className="btn-icon"
              onClick={toggleTheme}
              title={
                theme === "light"
                  ? "Mudar para tema escuro"
                  : "Mudar para tema claro"
              }
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="btn-primary" onClick={handlePrint}>
              <Download size={16} />
              Export to PDF
            </button>
          </div>
        </div>
      </header>

      <main className="editor-layout">
        <div className="editor-pane no-print">
          <div className="pane-header">
            <Code size={15} />
            <span>Markdown Editor</span>
          </div>
          <textarea
            className="editor-textarea"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="preview-pane printable">
          <div className="pane-header no-print">
            <FileText size={15} />
            <span>Live Preview</span>
          </div>

          {watermark.dataUrl && (
            <WatermarkOverlay
              dataUrl={watermark.dataUrl}
              opacity={watermark.opacity}
            />
          )}

          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkPageBreak]}
              components={{
                div({ className, ...props }) {
                  if (className?.includes("page-break")) {
                    return <PageBreak />;
                  }
                  return <div className={className} {...props} />;
                },
                code({ node, className, children, ...props }) {
                  const match = /language-mermaid/.exec(className || "");
                  return match ? (
                    <div className="mermaid-container">
                      <Mermaid
                        chart={String(children).replace(/\n$/, "")}
                        theme={theme}
                        onError={handleMermaidError}
                      />
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </main>

      <Toaster
        position="bottom-right"
        theme={theme}
        className="no-print"
        toastOptions={{ classNames: { toast: "no-print" } }}
      />
    </div>
  );
}

export default App;
