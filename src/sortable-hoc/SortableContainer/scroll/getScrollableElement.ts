import { getOwnerDocument } from '@/sortable-hoc/SortableContainer/scroll/getOwnerDocument';
import { canUseDOM, isDocument, isHTMLElement, isNode, isWindow } from '@/sortable-hoc/utils';

export function getScrollableElement(element: EventTarget | null) {
  if (!canUseDOM() || !element) {
    return null;
  }

  if (isWindow(element)) {
    return element;
  }

  if (!isNode(element)) {
    return null;
  }

  if (isDocument(element) || element === getOwnerDocument(element).scrollingElement) {
    return window;
  }

  if (isHTMLElement(element)) {
    return element;
  }

  return null;
}
