import { RangeSetBuilder } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";

/**
 * Matches the data URL portion inside a Markdown image:
 *   ![alt](data:image/...;base64,<LONG_STRING>)
 *
 * Capture groups:
 *   1 — the full data URL  (data:image/...;base64,XXXX)
 *   2 — the mime type      (e.g. "image/png")
 */
const DATA_URL_RE = /(data:(image\/[^;]+);base64,[A-Za-z0-9+/]+=*)/g;

/** Widget that replaces the raw base64 blob with a small readable badge */
class Base64ImageWidget extends WidgetType {
  mimeType: string;

  constructor(mimeType: string) {
    super();
    this.mimeType = mimeType;
  }

  eq(other: Base64ImageWidget) {
    return other.mimeType === this.mimeType;
  }

  toDOM() {
    const span = document.createElement("span");
    span.className = "cm-base64-placeholder";
    span.textContent = `[imagem: ${this.mimeType}]`;
    span.title = "Dados da imagem ocultados para melhor legibilidade";
    return span;
  }

  ignoreEvent() {
    return true;
  }
}

/** Builds the decoration set for the current visible ranges */
function buildDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();

  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to);
    let match: RegExpExecArray | null;

    DATA_URL_RE.lastIndex = 0;
    while ((match = DATA_URL_RE.exec(text)) !== null) {
      const start = from + match.index;
      const end = start + match[1].length;
      const mimeType = match[2];

      builder.add(
        start,
        end,
        Decoration.replace({ widget: new Base64ImageWidget(mimeType) }),
      );
    }
  }

  return builder.finish();
}

/** CodeMirror extension that collapses base64 image data URLs into a badge */
export const collapseBase64Images = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = buildDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildDecorations(update.view);
      }
    }
  },
  { decorations: (v) => v.decorations },
);
