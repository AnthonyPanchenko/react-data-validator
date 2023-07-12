import { MutableRefObject } from 'react';

import getClosestIndex from '@/drag-and-drop-sorting/utils';

type AccelerationType = {
  min: number;
  max: number;
  timer: NodeJS.Timer | null;
  thresholdActivator: number;
};

// type SortedNode = { offsetTop: number; index: number };

export default class DnDropSortingEventManager {
  container: MutableRefObject<HTMLDivElement | null>;
  // onSwapArrayItems: ((from: number, to: number) => void) | undefined;
  onRearrangeItems: ((from: number, to: number) => void) | undefined;
  startIndex = 0;
  startPosY = 0;
  isMoveActive = false;
  elementRelativeOffsetTop = 0;
  elementRect: DOMRect | null = null;
  containerRect: DOMRect | null = null;
  mouseMoveTimer: NodeJS.Timer | null = null;
  sortedNodes: Array<number> = [];

  acceleration: AccelerationType = {
    min: 2, // px
    max: 10, // px
    timer: null, // NodeJS.Timer
    thresholdActivator: 0.4 // unit range from 0 to 1
  };

  stateSetters: Record<
    string,
    {
      setPosition: (topY: number) => void;
      setActiveState: (isActive: boolean) => void;
      setTranslatePosition: (translateY: number) => void;
    }
  > = {};

  constructor(
    container: MutableRefObject<HTMLDivElement | null>,
    onRearrangeItems: (from: number, to: number) => void
  ) {
    this.container = container;
    this.onRearrangeItems = onRearrangeItems;
  }

  onRegisterStateSetters(
    setPosition: (topY: number) => void,
    setActiveState: (isActive: boolean) => void,
    setTranslatePosition: (translateY: number) => void,
    sourceKye: string
  ) {
    console.log('onRegisterStateSetters: ', sourceKye);
    this.stateSetters[sourceKye] = {
      setPosition,
      setActiveState,
      setTranslatePosition
    };
  }

  onRegisterEventInfo(sourceKye: string, event: MouseEvent | Touch, elementRect: DOMRect) {
    if (this.container.current) {
      // this.startIndex = index;
      this.startPosY = event.clientY;
      this.elementRect = elementRect;
      this.containerRect = this.container.current.getBoundingClientRect();
      this.elementRelativeOffsetTop = this.elementRect.top - this.containerRect.top;
    }
  }

  onMove(e: MouseEvent | Touch) {
    if (!this.elementRect || !this.containerRect) {
      return;
    }

    if (!this.isMoveActive && !!this.stateSetters[this.startIndex].setActiveState) {
      this.isMoveActive = true;
      this.stateSetters[this.startIndex].setActiveState(true);
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

      this.stateSetters[this.startIndex].setPosition(y);
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
    // this.onRearrangeItems(this.startIndex, closestIndex);
    this.clearScrollView();
    this.clearMouseMoveTimer();
    this.elementRect = null;
    this.containerRect = null;
    this.sortedNodes = [];

    if (this.isMoveActive && !!this.stateSetters[this.startIndex].setActiveState) {
      this.isMoveActive = false;
      this.stateSetters[this.startIndex].setActiveState(false);
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
        if (!this.sortedNodes.length) {
          this.container.current.childNodes.forEach(node => {
            if ((node as HTMLElement).dataset.sourceIndex !== undefined) {
              this.sortedNodes.push((node as HTMLElement).offsetTop);
            }
          });
        }

        const closestIndex = getClosestIndex(this.sortedNodes, currentElementY);

        if (this.startIndex !== closestIndex && direction !== 0 && this.onRearrangeItems) {
          console.clear();
          console.log(this.sortedNodes);
          console.log('closestIndex: ', closestIndex);
          console.log('direction: ', direction);
          console.log('swap: ', this.startIndex, 'to: ', closestIndex);

          if (Math.abs(this.startIndex - closestIndex) === 1) {
            this.stateSetters[this.startIndex].setTranslatePosition(
              this.sortedNodes[closestIndex] - 10
            );
            this.stateSetters[closestIndex].setTranslatePosition(
              10 - this.sortedNodes[closestIndex]
            );

            const b = this.sortedNodes[this.startIndex];
            this.sortedNodes[this.startIndex] = this.sortedNodes[closestIndex];
            this.sortedNodes[closestIndex] = b;
            this.startIndex = closestIndex;
          } else {
            console.log('other');
          }

          // for (let i = 0; i < array.length; i++) {
          //   const element = array[i];

          // }
        }
      }
    }, 200);
  }

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
