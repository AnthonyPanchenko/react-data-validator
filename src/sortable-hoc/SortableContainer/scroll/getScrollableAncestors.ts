import { isScrollable } from '@/sortable-hoc/SortableContainer/scroll/isScrollable';
import { getWindow, isDocument, isHTMLElement } from '@/sortable-hoc/utils';

export function getScrollableAncestors(element: HTMLElement | null | undefined): Array<Element> {
  const scrollParents: Array<Element> = [];

  function findScrollableAncestors(node: Node | null): Array<Element> {
    if (!node) {
      return scrollParents;
    }

    if (
      isDocument(node) &&
      node.scrollingElement != null &&
      !scrollParents.includes(node.scrollingElement)
    ) {
      scrollParents.push(node.scrollingElement);

      return scrollParents;
    }

    if (!isHTMLElement(node) || scrollParents.includes(node)) {
      return scrollParents;
    }

    const computedStyle = getWindow(element).getComputedStyle(node);

    if (node !== element && isScrollable(computedStyle)) {
      scrollParents.push(node);
    }

    if (computedStyle.position === 'fixed') {
      return scrollParents;
    }

    return findScrollableAncestors(node.parentNode);
  }

  if (!element) {
    return scrollParents;
  }

  return findScrollableAncestors(element);
}
