import { game } from './game.js';
import { FRASES, ORDEM, TITULOS } from './frases.js';

const wrap = document.getElementById('win-modal');
const titulo = document.getElementById('win-titulo');
const frase = document.getElementById('win-frase');
const nota = document.getElementById('win-nota');
const tempo = document.getElementById('win-tempo');
const vistas = new Set();

function fmtTempo(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

document.getElementById('win-ok').addEventListener('click', () => {
  wrap.classList.remove('exib-modal');
});

document.addEventListener('game:change', () => {
  for (const id of ORDEM) {
    const feito = id === 'final' ? game.status === 'won' : game.solved[id];
    if (feito && !vistas.has(id)) {
      vistas.add(id);
      if (id === 'final') {
        titulo.textContent = 'Parabéns!';
        frase.textContent = 'Você concluiu todos os enigmas.';
        nota.hidden = true;
        tempo.textContent = `Tempo: ${fmtTempo(game.maxTime - game.remaining)}`;
        tempo.hidden = false;
      } else {
        titulo.textContent = `${TITULOS[id]} concluído!`;
        frase.textContent = FRASES[id];
        nota.hidden = false;
        tempo.hidden = true;
      }
      wrap.classList.add('exib-modal');
      break;
    }
  }
});
