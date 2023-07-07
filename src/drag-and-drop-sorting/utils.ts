export function offsetXYFromParent<T extends HTMLElement>(pointerY: number, parentElement: T) {
  const offsetParentRect = parentElement.getBoundingClientRect();

  return pointerY + parentElement.scrollTop - offsetParentRect.top;
}

export function createClassName(...args: Array<string | number | undefined>) {
  return args.filter(c => typeof c === 'string' || typeof c === 'number').join(' ');
}
