interface WatermarkOverlayProps {
  dataUrl: string;
  opacity: number;
}

/**
 * Renders the watermark image centered and rotated 45° over the preview pane.
 *
 * Screen  — positioned fixed inside .preview-pane (pointer-events: none so it
 *           doesn't block text selection or scrolling).
 * Print   — position: fixed is kept, which causes the browser to repeat the
 *           element on every printed page automatically (standard CSS print
 *           behavior for fixed elements).
 */
export function WatermarkOverlay({ dataUrl, opacity }: WatermarkOverlayProps) {
  return (
    <div className="watermark-overlay" aria-hidden="true">
      <img
        src={dataUrl}
        alt=""
        className="watermark-img"
        style={{ opacity }}
        draggable={false}
      />
    </div>
  );
}
