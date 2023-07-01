import { useEffect, useRef } from 'react';

type TrackSizeValue = {
  scrollWidth: number;
  scrollHeight: number;
  clientWidth: number;
  clientHeight: number;
};

export default function useAutoScroller<T extends Element>(scrollAxis?: 'x' | 'y'): React.MutableRefObject<T | null> {
  const elementRef = useRef<T | null>(null);

  const trackSizeValue = useRef<TrackSizeValue>({
    scrollWidth: 0,
    scrollHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
  });

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    const debouncedResizeObserver = debounce(
      (entries: Array<ResizeObserverEntry>) => {
        const element = entries[0]?.target;
        if (element) {
          trackElementSizeBy<T>(
            element as T,
            trackSizeValue.current,
            track,
            onResize
          );
        }
      },
      300
    );

    const observer = new ResizeObserver(debouncedResizeObserver);

    observer.observe(elementRef.current);

    return () => {
      window.removeEventListener('mousemove', pointCB);
      window.removeEventListener('touchmove', pointCB);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  clear() {
    if (this.interval == null) {
      return;
    }

    clearInterval(this.interval);
    this.interval = null;
  }

  update({translate, minTranslate, maxTranslate, width, height}) {
    const direction = {
      x: 0,
      y: 0,
    };
    const speed = {
      x: 1,
      y: 1,
    };
    const acceleration = {
      x: 10,
      y: 10,
    };

    const {
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth,
      clientHeight,
      clientWidth,
    } = this.container;

    const isTop = scrollTop === 0;
    const isBottom = scrollHeight - scrollTop - clientHeight === 0;
    const isLeft = scrollLeft === 0;
    const isRight = scrollWidth - scrollLeft - clientWidth === 0;

    if (translate.y >= maxTranslate.y - height / 2 && !isBottom) {
      // Scroll Down
      direction.y = 1;
      speed.y =
        acceleration.y *
        Math.abs((maxTranslate.y - height / 2 - translate.y) / height);
    } else if (translate.x >= maxTranslate.x - width / 2 && !isRight) {
      // Scroll Right
      direction.x = 1;
      speed.x =
        acceleration.x *
        Math.abs((maxTranslate.x - width / 2 - translate.x) / width);
    } else if (translate.y <= minTranslate.y + height / 2 && !isTop) {
      // Scroll Up
      direction.y = -1;
      speed.y =
        acceleration.y *
        Math.abs((translate.y - height / 2 - minTranslate.y) / height);
    } else if (translate.x <= minTranslate.x + width / 2 && !isLeft) {
      // Scroll Left
      direction.x = -1;
      speed.x =
        acceleration.x *
        Math.abs((translate.x - width / 2 - minTranslate.x) / width);
    }

    if (this.interval) {
      this.clear();
      this.isAutoScrolling = false;
    }

    if (direction.x !== 0 || direction.y !== 0) {
      this.interval = setInterval(() => {
        this.isAutoScrolling = true;
        const offset = {
          left: speed.x * direction.x,
          top: speed.y * direction.y,
        };
        this.container.scrollTop += offset.top;
        this.container.scrollLeft += offset.left;

        this.onScrollCallback(offset);
      }, 5);
    }
  }


  return elementRef;
}
