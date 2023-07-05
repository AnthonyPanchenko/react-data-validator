export function offsetXYFromParent<T extends HTMLElement>(pointerY: number, parentElement: T) {
  const isBody = parentElement === parentElement.ownerDocument.body;
  const offsetParentRect = isBody ? { top: 0 } : parentElement.getBoundingClientRect();

  return pointerY + parentElement.scrollTop - offsetParentRect.top;
}

export function createClassName(...args: Array<string | number | undefined>) {
  return args.filter(c => typeof c === 'string' || typeof c === 'number').join(' ');
}
