import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  theme?: 'light' | 'dark';
  onError?: (error: string) => void;
}

const Mermaid: React.FC<MermaidProps> = ({ chart, theme = 'light', onError }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
      flowchart: { useMaxWidth: false, htmlLabels: true },
    });
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      if (!ref.current || !chart) return;

      try {
        ref.current.innerHTML = '';
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);

        if (isMounted && ref.current) {
          ref.current.innerHTML = svg;
          const svgElement = ref.current.querySelector('svg');
          if (svgElement) {
            const bbox = svgElement.getBBox();
            svgElement.setAttribute('width', (bbox.width + 20).toString());
            svgElement.setAttribute('height', (bbox.height + 20).toString());
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
          }
        }
      } catch (err: unknown) {
        if (isMounted && onError) {
          const message =
            err instanceof Error ? err.message : 'Erro de sintaxe no diagrama';
          onError(message);
        }
        if (ref.current) ref.current.innerHTML = '';
      }
    };

    renderChart();
    return () => {
      isMounted = false;
    };
  }, [chart, theme, onError]);

  return <div className="mermaid" ref={ref} />;
};

export default Mermaid;
