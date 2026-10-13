export function normalize(texto) {
  return String(texto ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
export function shake(elemento) {
  if (!elemento) return;
  elemento.classList.remove('shake');
  void elemento.offsetWidth;
  elemento.classList.add('shake');
  setTimeout(() => elemento.classList.remove('shake'), 300);
}
