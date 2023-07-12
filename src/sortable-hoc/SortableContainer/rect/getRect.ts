import type { ClientRect } from '../../types';

/**
 * Returns the bounding client rect of an element relative to the viewport.
 */
export function getClientRect(element: Element | null) {
  if (!element) {
    return null;
  }

  const rect: ClientRect = element.getBoundingClientRect();

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    bottom: rect.bottom,
    right: rect.right
  };
}
