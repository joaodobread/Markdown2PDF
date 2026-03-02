import { ImageOff, Stamp } from 'lucide-react';
import { useRef } from 'react';

interface WatermarkButtonProps {
  dataUrl: string | null;
  onLoad: (file: File) => void;
  onRemove: () => void;
}

export function WatermarkButton({ dataUrl, onLoad, onRemove }: WatermarkButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onLoad(file);
    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  if (dataUrl) {
    return (
      <div className="watermark-control">
        <img
          src={dataUrl}
          alt="Watermark"
          className="watermark-thumb"
          title="Clique para trocar a watermark"
          onClick={() => inputRef.current?.click()}
        />
        <button
          className="btn-icon watermark-remove"
          onClick={onRemove}
          title="Remover watermark"
          aria-label="Remover watermark"
        >
          <ImageOff size={16} />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  return (
    <>
      <button
        className="btn-icon"
        onClick={() => inputRef.current?.click()}
        title="Adicionar watermark ao PDF"
        aria-label="Adicionar watermark"
      >
        <Stamp size={18} />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}
