import { useEffect, useRef } from 'react';

export default function useScrollableContainer(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    const container = this.getContainer();

    this.container = containerNode;
    this.document = this.container.ownerDocument || document;

    /*
     *  Set our own default rather than using defaultProps because Jest
     *  snapshots will serialize window, causing a RangeError
     */
    const contentWindow = this.props.contentWindow || this.document.defaultView || window;

    this.contentWindow = typeof contentWindow === 'function' ? contentWindow() : contentWindow;

    this.scrollContainer = useWindowAsScrollContainer
      ? this.document.scrollingElement || this.document.documentElement
      : getScrollingParent(this.container) || this.container;

    meta.initContainerScroll = isWindowScrollContainer
      ? {
          x: window.scrollX,
          y: window.scrollY
        }
      : {
          x: dndSortingContainer.current?.scrollLeft || 0,
          y: dndSortingContainer.current?.scrollTop || 0
        };
  }, [value]);

  return ref.current;
}
