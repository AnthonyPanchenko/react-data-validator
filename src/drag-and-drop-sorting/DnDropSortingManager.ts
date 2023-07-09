import { MutableRefObject } from 'react';

type AccelerationType = {
  min: number;
  max: number;
  timer: NodeJS.Timer | null;
  thresholdActivator: number;
};

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

  acceleration: AccelerationType = {
    min: 2, // px
    max: 8, // px
    timer: null, // NodeJS.Timer
    thresholdActivator: 0.4 // unit range from 0 to 1
  };

  stateSetters: Record<
    number,
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
    index: number
  ) {
    console.log('onRegisterStateSetters: ', index);
    this.stateSetters[index] = {
      setPosition,
      setActiveState,
      setTranslatePosition
    };
  }

  onRegisterEventInfo(index: number, event: MouseEvent | Touch, elementRect: DOMRect) {
    if (this.container.current) {
      this.startIndex = index;
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
    this.clearScrollView();
    this.clearMouseMoveTimer();
    this.elementRect = null;
    this.containerRect = null;

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
        const arr: Array<{ offsetTop: number; index: number }> = [];

        this.container.current.childNodes.forEach(node => {
          if ((node as HTMLElement).dataset.sourceIndex !== undefined) {
            console.dir(node);
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

        if (this.startIndex !== closest.index) {
          console.log(arr);
          console.log('direction: ', direction);
          console.log('swap: ', this.startIndex, 'to: ', closest);

          // this.stateSetters[0].setTranslatePosition(109);
          // this.stateSetters[1].setTranslatePosition(-109);

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
