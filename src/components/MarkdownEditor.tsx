import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import CodeMirror, { type Extension } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import type { Theme } from "../types";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme: Theme;
}

/** Light theme that matches the app's design tokens */
const lightTheme = EditorView.theme(
  {
    "&": {
      background: "var(--editor-bg)",
      color: "var(--textarea-color)",
      height: "100%",
      fontFamily:
        "'Fira Code', 'Cascadia Code', 'Monaco', 'Menlo', monospace",
      fontSize: "0.9rem",
    },
    ".cm-content": {
      padding: "1.25rem 1.5rem",
      caretColor: "var(--primary)",
      lineHeight: "1.7",
    },
    ".cm-line": { padding: "0" },
    ".cm-gutters": { display: "none" },
    ".cm-focused": { outline: "none" },
    ".cm-cursor": { borderLeftColor: "var(--primary)" },
    ".cm-selectionBackground, ::selection": {
      background: "rgba(37,99,235,0.15) !important",
    },
    ".cm-activeLine": { background: "rgba(37,99,235,0.04)" },
    ".cm-scroller": { overflow: "auto" },
  },
  { dark: false },
);

const baseExtensions: Extension[] = [
  markdown({ base: markdownLanguage, codeLanguages: languages }),
  EditorView.lineWrapping,
];

export function MarkdownEditor({ value, onChange, theme }: MarkdownEditorProps) {
  const themeExtension: Extension =
    theme === "dark" ? oneDark : lightTheme;

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={[...baseExtensions, themeExtension]}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        dropCursor: false,
        allowMultipleSelections: true,
        indentOnInput: true,
        syntaxHighlighting: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: false,
        rectangularSelection: false,
        crosshairCursor: false,
        highlightActiveLine: true,
        highlightSelectionMatches: false,
        searchKeymap: true,
        closeBracketsKeymap: true,
        defaultKeymap: true,
        historyKeymap: true,
        foldKeymap: false,
        completionKeymap: false,
        lintKeymap: false,
      }}
      style={{ height: "100%", overflow: "hidden" }}
    />
  );
}
