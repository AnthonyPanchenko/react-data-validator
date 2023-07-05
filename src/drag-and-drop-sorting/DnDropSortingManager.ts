import { MutableRefObject } from 'react';

import { offsetXYFromParent } from '@/drag-and-drop-sorting/utils';

export default class DnDropSortingEventManager {
  container: MutableRefObject<HTMLDivElement | null>;
  setPosition: ((posY: number) => void) | undefined;
  setActiveState: ((isActive: boolean) => void) | undefined;
  startIndex = 0;
  // startPosY = 0;
  isMoveActive = false;

  constructor(container: MutableRefObject<HTMLDivElement | null>) {
    this.container = container;
  }

  onRegisterDragItem(
    setPosition: (posY: number) => void,
    setActiveState: (isActive: boolean) => void,
    event: MouseEvent | Touch,
    index: number
  ) {
    this.startIndex = index;
    this.setPosition = setPosition;
    this.setActiveState = setActiveState;
    // this.startPosY = event.pageY;
    console.log(event.target, event.pageY);
  }

  onMove(e: MouseEvent | Touch) {
    if (!this.setPosition) {
      return;
    }

    if (!this.isMoveActive && this.setActiveState) {
      this.isMoveActive = true;
      this.setActiveState(true);
    }

    if (this.container.current) {
      const y = offsetXYFromParent(e.pageY, this.container.current);
      this.setPosition(y);
    }

    // console.log(e.target, e.pageY);
  }

  onEndMove(e: MouseEvent | Touch) {
    if (this.isMoveActive && this.setActiveState) {
      console.log(e.target, e.pageY);
      this.isMoveActive = false;
      this.setActiveState(false);
      this.setActiveState = undefined;
      this.setPosition = undefined;
    }
  }
}
