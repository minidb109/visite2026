import { game } from '../core/game.js';

const INICIO = 'MORA';
const ALVO = 'RAMO';
const MAX_AP = 4;
const FUNCAO = {
  1: { 1: 'ESQ', 2: 'EXT', 3: 'PAR', 4: 'MEI' },
  2: { 1: 'MEI', 2: 'DIR', 3: 'EXT', 4: 'PAR' },
  3: { 1: 'MEI', 2: 'ESQ', 3: 'PAR', 4: 'EXT' },
  4: { 1: 'MEI', 2: 'DIR', 3: 'PAR', 4: 'EXT' },
};
const OPS = {
  ESQ: (w) => w.slice(1) + w[0],
  DIR: (w) => w[3] + w.slice(0, 3),
  PAR: (w) => w[1] + w[0] + w[3] + w[2],
  EXT: (w) => w[3] + w.slice(1, 3) + w[0],
  MEI: (w) => w[0] + w[2] + w[1] + w[3],
};

const root = document.querySelector('#a4 .conteudo');
let palavra = INICIO;
let n = 0;

root.innerHTML = `
  <p class="a4-palavra">${palavra}</p>
  <p class="a4-alvo">Alvo: ${ALVO}</p>
  <div class="a4-botoes">
    <button data-b="1">1</button><button data-b="2">2</button>
    <button data-b="3">3</button><button data-b="4">4</button>
  </div>
  <p class="a4-cont">0/4</p>
  <p class="a4-msg" role="status"></p>`;

function alcancavel(pal, usados) {
  if (pal === ALVO) return true;
  if (usados >= MAX_AP) return false;
  const prox = usados + 1;
  for (let b = 1; b <= 4; b++) {
    if (alcancavel(OPS[FUNCAO[prox][b]](pal), prox)) return true;
  }
  return false;
}
function reset(msg) {
  palavra = INICIO; n = 0;
  root.querySelector('.a4-palavra').textContent = palavra;
  root.querySelector('.a4-cont').textContent = '0/4';
  root.querySelector('.a4-msg').textContent = msg;
}
root.querySelector('.a4-botoes').addEventListener('click', (ev) => {
  if (game.isLocked('a4')) return;
  const btn = ev.target.closest('button');
  if (!btn) return;
  const fn = FUNCAO[n + 1][btn.dataset.b];
  palavra = OPS[fn](palavra);
  n++;
  root.querySelector('.a4-palavra').textContent = palavra;
  root.querySelector('.a4-cont').textContent = `${n}/4`;
  if (palavra === ALVO) { game.solve('a4'); return; }
  if (n >= MAX_AP || !alcancavel(palavra, n)) reset('A palavra retorna ao início.');
});
