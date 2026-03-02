import { useCallback, useState } from 'react';

interface WatermarkState {
  dataUrl: string | null;
  opacity: number;
}

export function useWatermark() {
  const [watermark, setWatermark] = useState<WatermarkState>({
    dataUrl: null,
    opacity: 0.15,
  });

  const loadFromFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setWatermark((prev) => ({ ...prev, dataUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const remove = useCallback(() => {
    setWatermark((prev) => ({ ...prev, dataUrl: null }));
  }, []);

  const setOpacity = useCallback((opacity: number) => {
    setWatermark((prev) => ({ ...prev, opacity }));
  }, []);

  return { watermark, loadFromFile, remove, setOpacity };
}
