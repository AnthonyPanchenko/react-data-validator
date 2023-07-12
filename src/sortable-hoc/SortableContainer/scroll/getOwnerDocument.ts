import { isDocument, isHTMLElement, isNode, isWindow } from '@/sortable-hoc/utils';

export function getOwnerDocument(target: Event['target']): Document {
  if (!target) {
    return document;
  }

  if (isWindow(target)) {
    return target.document;
  }

  if (!isNode(target)) {
    return document;
  }

  if (isDocument(target)) {
    return target;
  }

  if (isHTMLElement(target)) {
    return target.ownerDocument;
  }

  return document;
}
