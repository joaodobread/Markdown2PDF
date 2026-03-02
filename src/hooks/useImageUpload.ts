import { useCallback } from 'react';

/**
 * Converts an image File to a base64 data URL and returns a Markdown image
 * snippet ready to be inserted into the editor.
 *
 * Using base64 ensures the image is embedded in the document and renders
 * correctly in the preview and in the exported PDF without any external
 * dependency.
 */
export function useImageUpload(onInsert: (snippet: string) => void) {
  const upload = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result;
        if (typeof dataUrl !== 'string') return;

        // Derive a clean alt text from the filename (strip extension)
        const alt = file.name.replace(/\.[^.]+$/, '');
        const snippet = `![${alt}](${dataUrl})`;
        onInsert(snippet);
      };
      reader.readAsDataURL(file);
    },
    [onInsert],
  );

  return { upload };
}
