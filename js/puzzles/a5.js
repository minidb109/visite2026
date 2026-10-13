import { game } from '../core/game.js';

const PLACAS = [
  { n: 1, titulo: 'A ponte é insegura', texto: 'O terceiro suporte cede quando recebe carga. Reforce essa parte antes de abrir a ponte ao público.' },
  { n: 2, titulo: 'A ponte é antiquada', texto: 'Todos estão construindo pontes suspensas. Abandone o seu projeto e faça uma igual à deles.' },
  { n: 3, titulo: 'A ponte é difícil de atravessar', texto: 'O mecanismo de abertura exige força excessiva. Troque o mecanismo inteiro por um modelo novo.' },
  { n: 4, titulo: 'A ponte não deveria existir', texto: 'Não gosto da aparência dela. Destrua-a e não tente construir outra.' },
  { n: 5, titulo: 'A ponte apresenta um defeito recorrente', texto: 'A trava se solta quando o mecanismo é aberto rapidamente. Troque a ponte inteira por outro modelo.' },
];
const CERTA = { 1: 'Aceitar', 2: 'Rejeitar', 3: 'Adaptar', 4: 'Rejeitar', 5: 'Adaptar' };

const root = document.querySelector('#a5 .conteudo');
const julg = {};
let falhas = 0;
let visivel = 0;

root.innerHTML = `
  <div class="a5-nav">
    <button class="a5-antes" aria-label="Placa anterior">◀</button>
    <span class="a5-cont" role="status">1 de 5</span>
    <button class="a5-depois" aria-label="Próxima placa">▶</button>
  </div>
  <div class="a5-cartoes">${PLACAS.map(p => `
    <article class="a5-cartao" data-n="${p.n}"${p.n === 1 ? '' : ' hidden'}>
      <h4>${p.titulo}</h4>
      <p>${p.texto}</p>
      <div class="a5-acoes">
        <button data-j="Aceitar">ACEITAR</button>
        <button data-j="Adaptar">ADAPTAR</button>
        <button data-j="Rejeitar">REJEITAR</button>
      </div>
    </article>`).join('')}</div>
  <button class="a5-testar" disabled>Testar fechadura</button>
  <p class="a5-msg" role="status"></p>`;

function mostrar(dir = 0) {
  root.querySelectorAll('.a5-cartao').forEach((c, i) => {
    c.hidden = i !== visivel;
    c.classList.remove('entra-dir', 'entra-esq');
  });
  if (dir !== 0) {
    const atual = root.querySelectorAll('.a5-cartao')[visivel];
    void atual.offsetWidth;
    atual.classList.add(dir > 0 ? 'entra-dir' : 'entra-esq');
  }
  root.querySelector('.a5-cont').textContent = `${visivel + 1} de 5`;
  root.querySelector('.a5-antes').disabled = visivel === 0;
  root.querySelector('.a5-depois').disabled = visivel === PLACAS.length - 1;
}
mostrar();

root.querySelector('.a5-antes').addEventListener('click', () => {
  if (game.isLocked('a5')) return;
  if (visivel > 0) { visivel--; mostrar(-1); }
});
root.querySelector('.a5-depois').addEventListener('click', () => {
  if (game.isLocked('a5')) return;
  if (visivel < PLACAS.length - 1) { visivel++; mostrar(1); }
});

function pintar(n) {
  const cartao = root.querySelector(`.a5-cartao[data-n="${n}"]`);
  cartao.querySelectorAll('.a5-acoes button').forEach(b => {
    b.classList.toggle('escolhido', julg[n] === b.dataset.j);
  });
  cartao.classList.remove('errado');
}

root.querySelector('.a5-cartoes').addEventListener('click', (ev) => {
  if (game.isLocked('a5')) return;
  const b = ev.target.closest('.a5-acoes button');
  if (!b) return;
  const n = Number(b.closest('.a5-cartao').dataset.n);
  julg[n] = b.dataset.j;
  pintar(n);
  root.querySelector('.a5-testar').disabled = Object.keys(julg).length < 5;
});

root.querySelector('.a5-testar').addEventListener('click', () => {
  if (game.isLocked('a5')) return;
  const certas = [1, 2, 3, 4, 5].filter(n => julg[n] === CERTA[n]);
  if (certas.length === 5) {
    root.classList.add('aberta');
    game.solve('a5');
    return;
  }
  falhas++;
  root.querySelector('.a5-msg').textContent = `${certas.length} de 5 em acordo.`;
  if (falhas >= 3) {
    [1, 2, 3, 4, 5].filter(n => julg[n] !== CERTA[n]).forEach(n => {
      root.querySelector(`.a5-cartao[data-n="${n}"]`).classList.add('errado');
    });
    setTimeout(() => {
      root.querySelectorAll('.a5-cartao.errado').forEach(c => c.classList.remove('errado'));
    }, 2500);
  }
});
