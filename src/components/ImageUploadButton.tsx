import { ImagePlus } from "lucide-react";
import { useRef } from "react";

interface ImageUploadButtonProps {
  onUpload: (file: File) => void;
}

export function ImageUploadButton({ onUpload }: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  };

  return (
    <>
      <button
        className="btn-icon pane-btn"
        onClick={() => inputRef.current?.click()}
        title="Inserir imagem no editor"
        aria-label="Inserir imagem"
      >
        <ImagePlus size={15} />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
