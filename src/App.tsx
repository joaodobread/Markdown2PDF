import { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Mermaid from './components/Mermaid';
import { Download, FileText, Code, AlertTriangle, X, Sun, Moon } from 'lucide-react';
import './App.css';

const DEFAULT_MARKDOWN = `# MD Render Pro — Exemplo

Bem-vindo ao **MD Render Pro**, um editor Markdown com preview em tempo real,
suporte a diagramas [Mermaid](https://mermaid.js.org/) e exportação para PDF.

---

## Formatação de texto

Você pode escrever texto **negrito**, _itálico_, ~~tachado~~ e \`código inline\`.

> Blockquotes são úteis para destacar citações ou avisos importantes.

---

## Listas

### Lista ordenada
1. Instale as dependências com \`npm install\`
2. Inicie o servidor com \`npm run dev\`
3. Abra o navegador em \`http://localhost:5173\`

### Lista não ordenada
- Edite o Markdown no painel esquerdo
- Veja o preview atualizar em tempo real
- Exporte para PDF quando estiver pronto

---

## Tabela

| Recurso            | Suportado |
|--------------------|-----------|
| Markdown GFM       | ✅        |
| Diagramas Mermaid  | ✅        |
| Exportação PDF     | ✅        |
| Tema escuro/claro  | ✅        |

---

## Diagrama Mermaid

\`\`\`mermaid
flowchart LR
    A([Usuário]) --> B[Escreve Markdown]
    B --> C{Tem diagrama?}
    C -- Sim --> D[Mermaid renderiza SVG]
    C -- Não --> E[ReactMarkdown renderiza HTML]
    D --> F[Preview ao vivo]
    E --> F
    F --> G[Exportar PDF]
\`\`\`

---

## Bloco de código

\`\`\`typescript
function greet(name: string): string {
  return \`Olá, \${name}!\`;
}

console.log(greet('Mundo'));
\`\`\`
`;

interface Toast {
  id: string;
  message: string;
  exiting: boolean;
}

type Theme = 'light' | 'dark';

function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('md-theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('md-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const handlePrint = () => {
    window.print();
  };

  const dismissToast = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    // Remove from DOM after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback((message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => {
      if (prev.some((t) => t.message === message)) return prev;
      return [...prev, { id, message, exiting: false }];
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  }, [dismissToast]);

  return (
    <div className="app-container">
      <header className="no-print">
        <div className="header-content">
          <div className="logo">
            <FileText size={22} />
            <h1>Markdown2PDF</h1>
          </div>
          <div className="header-actions">
            <button
              className="btn-icon"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
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
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-mermaid/.exec(className || '');
                  return match ? (
                    <div className="mermaid-container">
                      <Mermaid
                        chart={String(children).replace(/\n$/, '')}
                        theme={theme}
                        onError={(msg) => addToast(`Mermaid: ${msg}`)}
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

      <div className="toast-container no-print">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast${toast.exiting ? ' toast--exit' : ''}`}
          >
            <AlertTriangle size={16} className="toast-icon" />
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => dismissToast(toast.id)}
              aria-label="Fechar notificação"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
