// Gera um SKU legível e único a partir de categoria/tamanho/cor + sufixo aleatório
export function generateSku(category: string, size: string, color: string): string {
  const clean = (v: string) =>
    v
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 3)
      .padEnd(3, 'X');

  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `${clean(category)}-${clean(size)}-${clean(color)}-${suffix}`;
}
