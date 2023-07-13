export function isScrollable(computedStyle: CSSStyleDeclaration): boolean {
  const overflowRegex = /(auto|scroll|overlay)/;
  const properties = ['overflow', 'overflowX', 'overflowY'];

  return properties.some(property => {
    const value = computedStyle[property as keyof CSSStyleDeclaration];

    return typeof value === 'string' ? overflowRegex.test(value) : false;
  });
}