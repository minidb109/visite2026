import { game } from './game.js';
import { FRASES, ORDEM } from './frases.js';

const btn = document.getElementById('notebook-toggle');
const wrap = document.getElementById('notebook-modal');
const shelf = document.getElementById('notebook-shelf');
const vistas = new Set();

btn.addEventListener('click', () => {
  wrap.classList.toggle('exib-modal');
});

document.getElementById('notebook-close').addEventListener('click', () => {
  wrap.classList.remove('exib-modal');
});

document.addEventListener('game:change', () => {
  for (const id of ORDEM) {
    const feito = id === 'final' ? game.status === 'won' : game.solved[id];
    if (feito && !vistas.has(id)) {
      vistas.add(id);
      const li = document.createElement('li');
      li.dataset.id = id;
      li.textContent = FRASES[id];
      shelf.appendChild(li);
    }
  }
});
