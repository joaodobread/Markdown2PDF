/**
 * PageBreak component
 *
 * Rendered when the user writes `---page---` in the Markdown editor.
 *
 * - Screen: shows a visual divider with a "Nova página" label.
 * - Print / PDF: the element forces a page break via CSS.
 */
export function PageBreak() {
  return (
    <div className="page-break" data-page-break="true" aria-label="Quebra de página" />
  );
}
