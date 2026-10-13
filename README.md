# VISITE 2026

Jogo cooperativo de 7 enigmas em uma caixa 3D: um jogador vê os enigmas, o outro tem o manual com as dicas. Um não vê a tela do outro.

## Como jogar

- **Player 1** abre `index.html`: 4 faces de cubo com 7 painéis (Enigmas 1–6 + Final).
- **Player 2** abre `manual.html` (ideal no celular): dicas para cada enigma, sem respostas diretas.
- Tempo total: **45 min**. Nos 5 min finais o relógio fica vermelho.
- Resolvam os 6 enigmas em qualquer ordem para liberar o Final. Reiniciar = recarregar a página.

## Como rodar

Os scripts usam `type="module"`, então exigem servidor HTTP (não funciona com duplo clique):

```bash
python -m http.server 8000
# jogo:   http://localhost:8000
# manual: http://localhost:8000/manual.html
```

Ou qualquer alternativa: Live Server (VS Code), `npx serve`, GitHub Pages.

## Estrutura

```
index.html          jogo (cubo, topo, modais)
manual.html         manual do Player 2 (estático, sem JS)
css/core.css        cubo, relógio, modais, painéis
css/manual.css      estilo do manual (+ impressão)
css/puzzles/        um CSS por enigma (classes prefixadas, ex. .a3-*)
js/core/game.js     estado: status, solved, tempo, solve(), isLocked()
js/core/main.js     giro do cubo, relógio, selos, modais
js/core/utils.js    normalize(), shake()
js/puzzles/         um módulo por enigma (a1–a6, final)
```

## Regras de contribuição

- Cada enigma só escreve dentro do próprio `#<id> .conteudo`.
- Toda interação começa com `if (game.isLocked("<id>")) return;`.
- A única forma de resolver é `game.solve("<id>")`, uma vez.
- O manual nunca contém resposta direta.
- Uma branch por tarefa (`feat/a3-grade`), revisão do outro antes do merge.

## Enigmas

| #   | Nome                       | Ideia                                    | Selo |
| --- | -------------------------- | ---------------------------------------- | ---- |
| 1   | Questione padrões          | Sequência + espelho                      | ○    |
| 2   | Aprenda com seus erros     | Cadeado de 3 dígitos com feedback Wordle | □    |
| 3   | Saia da zona de conforto   | Grade 4×4, cantos ordenados pela série   | ◇    |
| 4   | Nunca pare de se transformar | Palavra MORA → alvo em até 4 apertos   | ☆    |
| 5   | O tribunal das vozes       | Julgar 5 críticas: aceitar/adaptar/rejeitar | △  |
| 6   | A árvore das consequências | 6 pedras nas 6 casas numeradas           | ⬡    |
| F   | Quem disse isso?           | Cartão com os 6 selos + autor            | —    |

## Testes

Testes de comportamento com jsdom (fora do repo, em `/tmp/a1test/` e `/tmp/opencode/`): um arquivo por enigma (`test-a1.mjs`…`test-final.mjs`), mais `test-task1-full.mjs`, `test-task10.mjs`, `test-manual.mjs` e o ponta a ponta `test-e2e.mjs` (partida completa: 6 enigmas + final + vitória + derrota por tempo).
