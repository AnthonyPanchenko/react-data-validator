import { MutableRefObject } from 'react';

export default class DnDropSortingEventManager {
  interval: NodeJS.Timer | null = null;
  container: MutableRefObject<HTMLDivElement | null>;
  setPosition: ((posY: number) => void) | undefined;
  setActiveState: ((isActive: boolean) => void) | undefined;
  startIndex = 0;
  startPosY = 0;
  isMoveActive = false;
  elementOffsetTop = 0;
  elementRect: DOMRect | null = null;
  containerRect: DOMRect | null = null;

  acceleration = {
    min: 2, // px
    max: 10, // px
    interval: 5, //ms
    thresholdActivator: 0.35 // unit range from 0 to 1
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
      this.startPosY = event.pageY;
      this.elementRect = elementRect;
      this.containerRect = this.container.current.getBoundingClientRect();
      this.elementOffsetTop = this.elementRect.top - this.containerRect.top;
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
      const gap = 10; // ?border

      const delta = e.pageY - this.startPosY;
      const y = delta + this.elementOffsetTop - gap;

      const normalizedAcceleration = Math.abs(
        delta < 0
          ? delta / this.elementOffsetTop
          : delta / (this.containerRect.height - this.elementOffsetTop - gap)
      );

      this.setPosition(y);

      if (normalizedAcceleration > this.acceleration.thresholdActivator) {
        const acceleration = Math.min(
          Math.max(normalizedAcceleration * this.acceleration.max, this.acceleration.min),
          this.acceleration.max
        );

        this.scrollView(acceleration, delta, this.container.current);
      }
    }
  }

  onEndMove() {
    if (this.isMoveActive && this.setActiveState) {
      this.clearScrollView();
      this.isMoveActive = false;
      this.elementRect = null;
      this.containerRect = null;
      this.setActiveState(false);
      this.setActiveState = undefined;
      this.setPosition = undefined;
    }
  }

  clearScrollView() {
    if (this.interval == null) {
      return;
    }

    clearInterval(this.interval);
    this.interval = null;
  }

  scrollView(acceleration: number, delta: number, container: HTMLDivElement) {
    let direction = 0;

    if (delta === 0) {
      direction = 0;
    } else {
      direction = delta > 0 ? 1 : -1;
    }

    if (this.interval) {
      this.clearScrollView();
    }

    if (direction !== 0) {
      this.interval = setInterval(() => {
        container.scrollTop += acceleration * direction;
      }, 5);
    }
  }
}
