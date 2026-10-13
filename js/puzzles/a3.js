import { game } from '../core/game.js';
import { icone } from '../core/icones.js';

const SERIAL = 'KV-' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
const CONFORTO = {
  'circulo': 1, 'quadrado': 2, 'triangulo': 3, 'losango': 4, 'estrela': 5, 'coracao': 6, 'trevo': 7, 'lua': 8,
  'sol': 9, 'cruz': 10, 'xis': 11, 'nota': 12, 'raio': 13, 'flor': 14, 'folha': 15, 'chave': 16,
};
const SIMBOLOS = {
  A1: 'estrela', A2: 'lua', A3: 'sol', A4: 'chave',
  B1: 'nota', B2: 'circulo', B3: 'raio', B4: 'flor',
  C1: 'xis', C2: 'triangulo', C3: 'losango', C4: 'folha',
  D1: 'cruz', D2: 'trevo', D3: 'coracao', D4: 'quadrado',
};
const FORMATOS = [
  { forma: 'Quadrado', celulas: ['B2', 'B3', 'C2', 'C3'], alvos: ['A1', 'A4', 'D1', 'D4'] },
  { forma: 'Linha', celulas: ['B1', 'B2', 'B3', 'B4'], alvos: ['A2', 'A3', 'D2', 'D3'] },
  { forma: 'Linha', celulas: ['C1', 'C2', 'C3', 'C4'], alvos: ['A2', 'A3', 'D2', 'D3'] },
];
const SORTEADO = FORMATOS[Math.floor(Math.random() * FORMATOS.length)];
const ZONA = SORTEADO.celulas;
const ALVOS = SORTEADO.alvos;

// embaralha os 16 símbolos pela grade a cada partida
const POSICOES = [];
for (const lin of ['A', 'B', 'C', 'D']) {
  for (let c = 1; c <= 4; c++) POSICOES.push(lin + c);
}
const simbolosSorteados = POSICOES.map(p => SIMBOLOS[p]);
for (let i = simbolosSorteados.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [simbolosSorteados[i], simbolosSorteados[j]] = [simbolosSorteados[j], simbolosSorteados[i]];
}
const SIMB = {};
POSICOES.forEach((p, k) => { SIMB[p] = simbolosSorteados[k]; });

// ordem certa: alvos do formato pelo nº de conforto; último dígito par → crescente, ímpar → decrescente
const ORDEM_CERTA = [...ALVOS]
  .sort((a, b) => CONFORTO[SIMB[a]] - CONFORTO[SIMB[b]]);
if (Number(SERIAL.slice(-1)) % 2 !== 0) ORDEM_CERTA.reverse();

const root = document.querySelector('#a3 .conteudo');
let progresso = [];
let erros = 0;
let bloqueado = false;

root.innerHTML = `
  <p class="a3-serie">Série ${SERIAL} · erros <span class="a3-erros">0/3</span></p>
  <div class="a3-grade" role="group" aria-label="Botões"></div>
  <p class="a3-msg" role="status"></p>`;

const grade = root.querySelector('.a3-grade');
for (const lin of ['A', 'B', 'C', 'D']) {
  for (let c = 1; c <= 4; c++) {
    const id = lin + c;
    const b = document.createElement('button');
    b.className = 'a3-botao' + (ZONA.includes(id) ? ' aceso' : '');
    b.dataset.pos = id;
    b.innerHTML = icone(SIMB[id]);
    b.setAttribute('aria-label', id);
    grade.appendChild(b);
  }
}
function pintar() {
  root.querySelector('.a3-erros').textContent = `${erros}/3`;
  grade.querySelectorAll('.a3-botao').forEach(b => {
    b.classList.toggle('marcado', progresso.includes(b.dataset.pos));
  });
}
pintar();

grade.addEventListener('click', (ev) => {
  if (game.isLocked('a3')) return;
  if (bloqueado) return;
  const btn = ev.target.closest('.a3-botao');
  if (!btn) return;
  const pos = btn.dataset.pos;
  const esperado = ORDEM_CERTA[progresso.length];
  if (pos === esperado) {
    progresso.push(pos);
    pintar();
    if (progresso.length === ORDEM_CERTA.length) game.solve('a3');
  } else {
    erros++;
    progresso = [];
    if (erros >= 3) {
      erros = 0;
      bloqueado = true;
      root.querySelector('.a3-msg').textContent = 'Zona instável — aguarde 3 s';
      grade.classList.add('piscar');
      setTimeout(() => { bloqueado = false; grade.classList.remove('piscar'); root.querySelector('.a3-msg').textContent = ''; }, 3000);
    }
    pintar();
  }
});
