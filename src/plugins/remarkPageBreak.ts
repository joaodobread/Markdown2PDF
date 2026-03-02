import type { Root } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

/**
 * Remark plugin that converts `---page---` into a custom pageBreak node.
 *
 * Usage in Markdown:
 *   ---page---
 *
 * In the preview a visual "page break" divider is shown.
 * In print / PDF a CSS `page-break-before: always` is applied.
 */
const remarkPageBreak: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || index === undefined) return;

      const children = node.children;
      if (children.length !== 1) return;

      const child = children[0];
      if (child.type !== 'text') return;

      const trimmed = child.value.trim();
      if (trimmed !== '---page---') return;

      // Replace the paragraph node with a custom pageBreak node.
      // We use hast properties so rehype renders a <div data-page-break>.
      parent.children.splice(index, 1, {
        type: 'pageBreak' as 'paragraph',
        data: {
          hName: 'div',
          hProperties: { className: ['page-break'], 'data-page-break': 'true' },
        },
        children: [],
      } as unknown as typeof node);
    });
  };
};

export default remarkPageBreak;
