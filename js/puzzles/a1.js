import { game } from '../core/game.js';
import { shake } from '../core/utils.js';

const SEQ_NORMAL = [2, 4, 8, 16];
const RESPOSTA = 1;
const MSG_ERRO = 'Essa resposta ainda não encaixa.';

const root = document.querySelector('#a1 .conteudo');
let inverted = false;

root.innerHTML = `
  <div class="a1-seq"><span class="a1-nums"></span> → <span class="a1-q" role="button" tabindex="0" title="?" aria-label="Virar a sequência">?</span></div>
  <div class="a1-linha">
    <input class="a1-campo" type="number" aria-label="Resposta do padrão">
    <button class="a1-ok">Responder</button>
  </div>
  <p class="a1-msg" role="status"></p>`;

function render() {
  const seq = inverted ? [...SEQ_NORMAL].reverse() : SEQ_NORMAL;
  root.querySelector('.a1-nums').textContent = seq.join(' → ');
}

function virar() {
  if (game.isLocked('a1')) return;
  inverted = !inverted;
  render();
}
render();

root.querySelector('.a1-q').addEventListener('click', virar);
root.querySelector('.a1-q').addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter' || ev.key === ' ') {
    ev.preventDefault();
    virar();
  }
});

const campo = root.querySelector('.a1-campo');
campo.setAttribute('inputmode', 'numeric');
campo.setAttribute('autocomplete', 'off');
campo.setAttribute('autocorrect', 'off');
campo.setAttribute('autocapitalize', 'off');
campo.setAttribute('spellcheck', 'false');
campo.addEventListener('keydown', (ev) => {
  if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
  const livres = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (livres.includes(ev.key)) return;
  if (!/^\d$/.test(ev.key)) ev.preventDefault();
});
function soDigitos() {
  const limpo = campo.value.replace(/\D/g, '');
  if (campo.value !== limpo) campo.value = limpo;
}
campo.addEventListener('beforeinput', (ev) => {
  if (typeof ev.data === 'string' && /[^\d]/.test(ev.data)) ev.preventDefault();
});
campo.addEventListener('input', soDigitos);
campo.addEventListener('change', soDigitos);
campo.addEventListener('compositionend', () => setTimeout(soDigitos, 0));

root.querySelector('.a1-ok').addEventListener('click', () => {
  if (game.isLocked('a1')) return;
  const raw = root.querySelector('.a1-campo').value;
  const n = Number(raw);
  if (inverted && raw !== '' && n === RESPOSTA) {
    game.solve('a1');
  } else {
    root.querySelector('.a1-msg').textContent = MSG_ERRO;
    shake(root);
  }
});
