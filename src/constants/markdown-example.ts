export const DEFAULT_MARKDOWN = `# Markdown2PDF — Exemplo

Bem-vindo ao **Markdown2PDF**, um editor Markdown com preview em tempo real,
suporte a diagramas [Mermaid](https://mermaid.js.org/) e exportação para PDF.

---

## Formatação de texto

Você pode escrever texto **negrito**, _itálico_, ~~tachado~~ e \`código inline\`.

> Blockquotes são úteis para destacar citações ou avisos importantes.

---

## Listas

### Lista ordenada
1. Instale as dependências com \`npm install\`
2. Inicie o servidor com \`npm run dev\`
3. Abra o navegador em \`http://localhost:5173\`

### Lista não ordenada
- Edite o Markdown no painel esquerdo
- Veja o preview atualizar em tempo real
- Exporte para PDF quando estiver pronto

---

## Tabela

| Recurso            | Suportado |
|--------------------|-----------|
| Markdown GFM       | ✅        |
| Diagramas Mermaid  | ✅        |
| Exportação PDF     | ✅        |
| Tema escuro/claro  | ✅        |

---

## Diagrama Mermaid

\`\`\`mermaid
flowchart LR
    A([Usuário]) --> B[Escreve Markdown]
    B --> C{Tem diagrama?}
    C -- Sim --> D[Mermaid renderiza SVG]
    C -- Não --> E[ReactMarkdown renderiza HTML]
    D --> F[Preview ao vivo]
    E --> F
    F --> G[Exportar PDF]
\`\`\`

---

## Bloco de código

\`\`\`typescript
function greet(name: string): string {
  return \`Olá, \${name}!\`;
}

console.log(greet('Mundo'));
\`\`\`

---page---

## Segunda página

Este conteúdo começa em uma nova página no PDF exportado.
Use \`---page---\` para controlar onde cada página começa.
`;
