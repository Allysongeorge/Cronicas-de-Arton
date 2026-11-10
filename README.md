# Crônicas de Arton — Atualização: Progressão de Classe

Esta atualização adiciona a aba **Progressão** à ficha. Ela mostra as habilidades fixas da classe por nível e permite registrar o nome dos poderes escolhidos nos níveis liberados.

## Arquivos
- `index.html` — adiciona a aba Progressão à navegação.
- `style.css` — estilos dos cartões de progressão.
- `app.js` — tabelas de progressão, registro de poderes, bloqueio por nível e migração dos dados salvos/importados.

## Como atualizar no GitHub
Substitua os três arquivos atuais na raiz do repositório (`index.html`, `style.css` e `app.js`) pelos arquivos deste pacote. Depois abra o site e atualize com Ctrl+F5. Os dados salvos no navegador são mantidos; os novos campos são adicionados automaticamente.

## Escopo desta etapa
A aba registra os poderes escolhidos, inclusive quando o personagem escolhe substituir um poder de classe por um poder geral. A lista catalogada de poderes com validação automática de pré-requisitos será desenvolvida em uma etapa futura.
