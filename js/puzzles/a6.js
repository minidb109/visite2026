import { game } from '../core/game.js';
import { shake } from '../core/utils.js';
import { icone } from '../core/icones.js';

const ORDEM = { 1: 'Bússola', 2: 'Livro aberto', 3: 'Árvore com raízes', 4: 'Pena e pergaminho', 5: 'Ampulheta', 6: 'Pegadas' };
const ICONE = { 'Bússola': 'bussola', 'Livro aberto': 'livro', 'Árvore com raízes': 'arvore', 'Pena e pergaminho': 'pena', 'Ampulheta': 'ampulheta', 'Pegadas': 'pegadas' };
const MSG_ERRO = 'A árvore permanece imóvel.';

const root = document.querySelector('#a6 .conteudo');
const casas = {};
let selPedra = null;
let falhas = 0;
let bloqueioAte = 0;

const ordemEmbaralhada = ['Pena e pergaminho', 'Bússola', 'Pegadas', 'Ampulheta', 'Livro aberto', 'Árvore com raízes'];

root.innerHTML = `
  <div class="a6-pedras">${ordemEmbaralhada.map(n => `<button class="a6-pedra" data-n="${n}" aria-label="${n}">${icone(ICONE[n])}</button>`).join('')}</div>
  <ol class="a6-arvore">${[1, 2, 3, 4, 5, 6].map(i => `<li><button class="a6-casa" data-c="${i}">${i}: ·</button></li>`).join('')}</ol>
  <button class="a6-ok" disabled>Confirmar</button>
  <p class="a6-msg" role="status"></p>`;

function atualiza() {
  root.querySelectorAll('.a6-casa').forEach(b => {
    const c = b.dataset.c;
    b.innerHTML = casas[c] ? `${c}: ${icone(ICONE[casas[c]])}` : `${c}: ·`;
  });
  root.querySelector('.a6-ok').disabled = Object.keys(casas).length < 6;
}
root.querySelector('.a6-pedras').addEventListener('click', (ev) => {
  if (game.isLocked('a6')) return;
  const b = ev.target.closest('.a6-pedra');
  if (!b) return;
  selPedra = b.dataset.n;
  root.querySelectorAll('.a6-pedra').forEach(x => x.classList.toggle('sel', x === b));
});
root.querySelector('.a6-arvore').addEventListener('click', (ev) => {
  if (game.isLocked('a6')) return;
  const b = ev.target.closest('.a6-casa');
  if (!b || !selPedra) return;
  for (const c of Object.keys(casas)) { if (casas[c] === selPedra) delete casas[c]; }
  casas[b.dataset.c] = selPedra;
  atualiza();
});
root.querySelector('.a6-ok').addEventListener('click', () => {
  if (game.isLocked('a6')) return;
  if (Date.now() < bloqueioAte) return;
  const ok = [1, 2, 3, 4, 5, 6].every(i => casas[String(i)] === ORDEM[i]);
  if (ok) {
    root.classList.add('floresce');
    game.solve('a6');
  } else {
    falhas++;
    root.querySelector('.a6-msg').textContent = MSG_ERRO;
    shake(root);
    if (falhas >= 3) {
      falhas = 0;
      bloqueioAte = Date.now() + 10000;
      const btn = root.querySelector('.a6-ok');
      btn.disabled = true;
      root.querySelector('.a6-msg').textContent = MSG_ERRO + ' Aguarde 10 s.';
      setTimeout(() => { btn.disabled = false; atualiza(); }, 10000);
    }
  }
});
