import { Download, FileText, Moon, Sun } from 'lucide-react';
import type { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onExport: () => void;
}

export function Header({ theme, onToggleTheme, onExport }: HeaderProps) {
  return (
    <header className="no-print">
      <div className="header-content">
        <div className="logo">
          <FileText size={22} />
          <h1>Markdown2PDF</h1>
        </div>
        <div className="header-actions">
          <button
            className="btn-icon"
            onClick={onToggleTheme}
            title={
              theme === 'light'
                ? 'Mudar para tema escuro'
                : 'Mudar para tema claro'
            }
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="btn-primary" onClick={onExport}>
            <Download size={16} />
            Export to PDF
          </button>
        </div>
      </div>
    </header>
  );
}
