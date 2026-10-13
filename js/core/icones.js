export function icone(id, rotulo) {
  const aria = rotulo
    ? ` role="img" aria-label="${rotulo}"`
    : ' aria-hidden="true"';
  return `<svg class="icone"${aria}><use href="assets/icones.svg#${id}"></use></svg>`;
}
