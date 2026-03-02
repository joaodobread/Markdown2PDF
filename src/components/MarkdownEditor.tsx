import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import CodeMirror, {
  type Extension,
  type ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { forwardRef, useImperativeHandle, useRef } from "react";
import type { Theme } from "../types";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme: Theme;
}

export interface MarkdownEditorHandle {
  /** Inserts text at the current cursor position (or replaces selection). */
  insert: (text: string) => void;
}

/** Light theme that matches the app's design tokens */
const lightTheme = EditorView.theme(
  {
    "&": {
      background: "var(--editor-bg)",
      color: "var(--textarea-color)",
      height: "100%",
      fontFamily: "'Fira Code', 'Cascadia Code', 'Monaco', 'Menlo', monospace",
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

export const MarkdownEditor = forwardRef<
  MarkdownEditorHandle,
  MarkdownEditorProps
>(function MarkdownEditor({ value, onChange, theme }, ref) {
  const cmRef = useRef<ReactCodeMirrorRef>(null);

  useImperativeHandle(ref, () => ({
    insert(text: string) {
      const view = cmRef.current?.view;
      if (!view) return;

      const { from, to } = view.state.selection.main;
      view.dispatch({
        changes: { from, to, insert: text },
        selection: { anchor: from + text.length },
      });
      view.focus();
    },
  }));

  const themeExtension: Extension = theme === "dark" ? oneDark : lightTheme;

  return (
    <CodeMirror
      ref={cmRef}
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
});
