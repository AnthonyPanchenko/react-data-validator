import { MutableRefObject } from 'react';

type AccelerationType = {
  min: number;
  max: number;
  timer: NodeJS.Timer | null;
  thresholdActivator: number;
};

export default class DnDropSortingEventManager {
  container: MutableRefObject<HTMLDivElement | null>;
  setPosition: ((posY: number) => void) | undefined;
  setActiveState: ((isActive: boolean) => void) | undefined;
  startIndex = 0;
  startPosY = 0;
  isMoveActive = false;
  elementRelativeOffsetTop = 0;
  elementRect: DOMRect | null = null;
  containerRect: DOMRect | null = null;
  mouseMoveTimer: NodeJS.Timer | null = null;

  acceleration: AccelerationType = {
    min: 2, // px
    max: 8, // px
    timer: null, // NodeJS.Timer
    thresholdActivator: 0.4 // unit range from 0 to 1
  };

  constructor(container: MutableRefObject<HTMLDivElement | null>) {
    this.container = container;
  }

  onRegisterDragItem(
    setPosition: (posY: number) => void,
    setActiveState: (isActive: boolean) => void,
    event: MouseEvent | Touch,
    index: number,
    elementRect: DOMRect
  ) {
    if (this.container.current) {
      this.startIndex = index;
      this.setPosition = setPosition;
      this.setActiveState = setActiveState;
      this.startPosY = event.clientY;
      this.elementRect = elementRect;
      this.containerRect = this.container.current.getBoundingClientRect();
      this.elementRelativeOffsetTop = this.elementRect.top - this.containerRect.top;
    }
  }

  onMove(e: MouseEvent | Touch) {
    if (!this.setPosition) {
      return;
    }

    if (!this.isMoveActive && this.setActiveState) {
      this.isMoveActive = true;
      this.setActiveState(true);
    }

    if (this.container.current && this.elementRect && this.containerRect) {
      const delta = e.clientY - this.startPosY;
      // based on position: fixed;
      const y = delta + this.elementRect.top;
      const direction = !delta ? 0 : delta > 0 ? 1 : -1;

      const normalizedAcceleration = Math.abs(
        delta < 0
          ? delta / this.elementRelativeOffsetTop
          : delta / (this.containerRect.height - this.elementRelativeOffsetTop)
      );

      this.setPosition(y);
      this.clearMouseMoveTimer();

      this.onStopMove(
        delta + this.elementRelativeOffsetTop + this.container.current.scrollTop,
        direction
      );

      if (normalizedAcceleration > this.acceleration.thresholdActivator) {
        const acceleration = Math.min(
          Math.max(normalizedAcceleration * this.acceleration.max, this.acceleration.min),
          this.acceleration.max
        );

        this.scrollView(acceleration, direction, delta, this.container.current);
      } else {
        this.clearScrollView();
      }
    }
  }

  onEndMove() {
    this.clearScrollView();
    this.clearMouseMoveTimer();
    this.isMoveActive = false;
    this.elementRect = null;
    this.containerRect = null;
    this.setPosition = undefined;
    if (this.setActiveState) {
      this.setActiveState(false);
      this.setActiveState = undefined;
    }
  }

  clearMouseMoveTimer() {
    if (this.mouseMoveTimer !== null) {
      clearTimeout(this.mouseMoveTimer);
      this.mouseMoveTimer = null;
    }
  }

  onStopMove(currentElementY: number, direction: number) {
    this.mouseMoveTimer = setTimeout(() => {
      if (this.container.current) {
        const arr: Array<{ offsetTop: number; index: number }> = [];

        this.container.current.childNodes.forEach(node => {
          if ((node as HTMLElement).dataset.sourceIndex !== undefined) {
            arr.push({
              offsetTop: (node as HTMLElement).offsetTop,
              index: Number((node as HTMLElement).dataset.sourceIndex)
            });
          }
        });

        const closest = arr.reduce((prev, curr) =>
          Math.abs(curr.offsetTop - currentElementY) < Math.abs(prev.offsetTop - currentElementY)
            ? curr
            : prev
        );

        console.log('direction: ', direction);
        console.log('swap: ', this.startIndex, 'to: ', closest);
      }
    }, 200);
  }

  // onRearrangeElements() {

  // }

  clearScrollView() {
    if (this.acceleration.timer !== null) {
      clearInterval(this.acceleration.timer);
      this.acceleration.timer = null;
    }
  }

  scrollView(acceleration: number, direction: number, delta: number, container: HTMLDivElement) {
    this.clearScrollView();
    const maxScroll = container.scrollHeight - container.clientHeight;

    this.acceleration.timer = setInterval(() => {
      const scrollTopValue = Math.min(
        Math.max(container.scrollTop + acceleration * direction, 0),
        maxScroll
      );

      container.scrollTo({ top: scrollTopValue });

      if (scrollTopValue === maxScroll || scrollTopValue === 0) {
        this.clearMouseMoveTimer();
        this.onStopMove(delta + this.elementRelativeOffsetTop + scrollTopValue, direction);
        this.clearScrollView();
      }
    }, 5);
  }
}
