export function offsetXYFromParent<T extends HTMLElement>(
  pointerX: number,
  pointerY: number,
  parentElement: T,
  scale: number
): [number, number] {
  const isBody = parentElement === parentElement.ownerDocument.body;
  const offsetParentRect = isBody ? { left: 0, top: 0 } : parentElement.getBoundingClientRect();

  const x = (pointerX + parentElement.scrollLeft - offsetParentRect.left) / scale;
  const y = (pointerY + parentElement.scrollTop - offsetParentRect.top) / scale;

  return [x, y];
}

export function createClassName(...args: Array<string | number | undefined>) {
  return args.filter(c => typeof c === 'string' || typeof c === 'number').join(' ');
}
