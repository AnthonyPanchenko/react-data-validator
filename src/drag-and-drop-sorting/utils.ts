export function createClassName(...args: Array<string | number | undefined>) {
  return args.filter(c => typeof c === 'string' || typeof c === 'number').join(' ');
}
