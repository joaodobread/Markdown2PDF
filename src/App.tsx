import { Code, Download, FileText, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { toast, Toaster } from "sonner";
import "./App.css";
import { ImageUploadButton } from "./components/ImageUploadButton";
import {
  MarkdownEditor,
  type MarkdownEditorHandle,
} from "./components/MarkdownEditor";
import Mermaid from "./components/Mermaid";
import { PageBreak } from "./components/PageBreak";
import { WatermarkButton } from "./components/WatermarkButton";
import { WatermarkOverlay } from "./components/WatermarkOverlay";
import { getDefaultMarkdown } from "./constants/markdown-example";
import { useImageUpload } from "./hooks/useImageUpload";
import { useWatermark } from "./hooks/useWatermark";
import remarkPageBreak from "./plugins/remarkPageBreak";

type Theme = "light" | "dark";

function App() {
  const [markdown, setMarkdown] = useState(() =>
    getDefaultMarkdown(import.meta.env.BASE_URL),
  );
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("md-theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const editorRef = useRef<MarkdownEditorHandle>(null);
  const { watermark, loadFromFile, remove: removeWatermark } = useWatermark();
  const { upload: uploadImage } = useImageUpload((snippet) => {
    editorRef.current?.insert(`\n${snippet}\n`);
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("md-theme", theme);
  }, [theme]);

  // Swap highlight.js theme stylesheet when the app theme changes
  useEffect(() => {
    const id = "hljs-theme";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href =
      theme === "dark"
        ? new URL("highlight.js/styles/github-dark.min.css", import.meta.url)
            .href
        : new URL("highlight.js/styles/github.min.css", import.meta.url).href;
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const handlePrint = () => window.print();
  const handleMermaidError = (msg: string) =>
    toast.error(`Mermaid: ${msg}`, { duration: 5000 });

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
            <div className="pane-header-actions">
              <ImageUploadButton onUpload={uploadImage} />
            </div>
          </div>
          <MarkdownEditor
            ref={editorRef}
            value={markdown}
            onChange={setMarkdown}
            theme={theme}
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
              rehypePlugins={[rehypeHighlight]}
              components={{
                div({ className, ...props }) {
                  if (className?.includes("page-break")) {
                    return <PageBreak />;
                  }
                  return <div className={className} {...props} />;
                },
                code({ className, children, ...props }) {
                  const isMermaid = /language-mermaid/.exec(className || "");
                  if (isMermaid) {
                    return (
                      <div className="mermaid-container">
                        <Mermaid
                          chart={String(children).replace(/\n$/, "")}
                          theme={theme}
                          onError={handleMermaidError}
                        />
                      </div>
                    );
                  }
                  return (
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
