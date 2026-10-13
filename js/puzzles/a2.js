import { game } from '../core/game.js';
import { shake } from '../core/utils.js';
import { icone } from '../core/icones.js';

const CODIGO = ['0', '4', '2'];
const MAX_TENT = 5;
const SIMBOLOS = [
  { certo: 'sol', pos: 'lua', aus: 'gota' },
  { certo: 'estrela', pos: 'folha', aus: 'montanha' },
  { certo: 'chave', pos: 'ancora', aus: 'sino' },
  { certo: 'coroa', pos: 'olho', aus: 'raio' },
  { certo: 'concha', pos: 'chama', aus: 'nuvem' },
];

const root = document.querySelector('#a2 .conteudo');
let tentativa = 1;

root.innerHTML = `
  <div class="a2-cadeado">
    <div class="a2-alca" aria-hidden="true"></div>
    <div class="a2-corpo">
      <div class="a2-entradas">
        <input class="a2-d" maxlength="1" inputmode="numeric" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Dígito 1">
        <input class="a2-d" maxlength="1" inputmode="numeric" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Dígito 2">
        <input class="a2-d" maxlength="1" inputmode="numeric" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Dígito 3">
        <button class="a2-ok">Tentar</button>
      </div>
    </div>
  </div>
  <ul class="a2-lista"></ul>
  <p class="a2-msg" role="status"></p>`;

function avaliar(palpite) {
  const res = ['aus', 'aus', 'aus'];
  const usado = [false, false, false];
  for (let i = 0; i < 3; i++) {
    if (palpite[i] === CODIGO[i]) { res[i] = 'certo'; usado[i] = true; }
  }
  for (let i = 0; i < 3; i++) {
    if (res[i] === 'certo') continue;
    for (let j = 0; j < 3; j++) {
      if (!usado[j] && palpite[i] === CODIGO[j]) { res[i] = 'pos'; usado[j] = true; break; }
    }
  }
  return res;
}

const LIVRES_A2 = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
function soDigitosA2(el) {
  const limpo = el.value.replace(/\D/g, '').slice(0, 1);
  if (el.value !== limpo) el.value = limpo;
}

root.querySelector('.a2-entradas').addEventListener('keydown', (ev) => {
  const el = ev.target.closest('.a2-d');
  if (!el) return;
  if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
  if (LIVRES_A2.includes(ev.key)) return;
  if (!/^\d$/.test(ev.key)) ev.preventDefault();
});
root.querySelector('.a2-entradas').addEventListener('beforeinput', (ev) => {
  const el = ev.target.closest('.a2-d');
  if (!el) return;
  if (typeof ev.data === 'string' && /[^\d]/.test(ev.data)) ev.preventDefault();
});
root.querySelector('.a2-entradas').addEventListener('input', (ev) => {
  const el = ev.target.closest('.a2-d');
  if (!el) return;
  soDigitosA2(el);
  if (/^[0-9]$/.test(el.value)) {
    const inputs = [...root.querySelectorAll('.a2-d')];
    const next = inputs[inputs.indexOf(el) + 1];
    if (next) next.focus();
  }
});
root.querySelector('.a2-entradas').addEventListener('change', (ev) => {
  const el = ev.target.closest('.a2-d');
  if (!el) return;
  soDigitosA2(el);
});
root.querySelector('.a2-entradas').addEventListener('compositionend', (ev) => {
  const el = ev.target.closest('.a2-d');
  if (!el) return;
  setTimeout(() => soDigitosA2(el), 0);
});

root.querySelector('.a2-ok').addEventListener('click', () => {
  if (game.isLocked('a2')) return;
  const digs = [...root.querySelectorAll('.a2-d')].map(el => el.value.trim());
  if (digs.some(d => !/^[0-9]$/.test(d))) {
    root.querySelector('.a2-msg').textContent = 'Digite 3 dígitos de 0 a 9.';
    shake(root);
    return;
  }
  const aval = avaliar(digs);
  if (digs.join('') === CODIGO.join('')) { game.solve('a2'); return; }
  const simb = SIMBOLOS[(tentativa - 1) % MAX_TENT];
  const li = document.createElement('li');
  li.innerHTML = `${digs.join('')} — ${aval.map(a => icone(simb[a === 'certo' ? 'certo' : a === 'pos' ? 'pos' : 'aus'])).join(' ')}`;
  root.querySelector('.a2-lista').appendChild(li);
  root.querySelector('.a2-msg').textContent = '';
  tentativa++;
});
