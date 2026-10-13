import { game } from '../core/game.js';
import { normalize } from '../core/utils.js';

const AUTORES = ['nietzsche', 'friedrich nietzsche', 'friedrich wilhelm nietzsche', 'nietsche', 'nitzsche', 'nietzche'];
const MSG_AUTOR = 'Não é essa a voz.';

const root = document.querySelector('#final .conteudo');
let venceu = false;

root.innerHTML = `
  <p class="final-dica">Utilize as dicas para responder</p>
  <div class="final-cadeado">
    <div class="final-alca" aria-hidden="true"></div>
    <div class="final-corpo">
      <label>Quem é o filósofo? <input class="final-campo" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></label>
      <button class="final-ok">Confirmar</button>
    </div>
  </div>
  <p class="final-msg" role="status"></p>
  <div class="final-caixa">Caixa aberta!</div>`;

root.querySelector('.final-ok').addEventListener('click', () => {
  if (game.isLocked('final')) return;
  const v = normalize(root.querySelector('.final-campo').value);
  if (AUTORES.includes(v)) {
    game.solve('final');
  } else {
    root.querySelector('.final-msg').textContent = MSG_AUTOR;
  }
});
document.addEventListener('game:change', () => {
  if (game.status === 'won' && !venceu) {
    venceu = true;
    root.querySelector('.final-caixa').classList.add('visivel');
  }
});
