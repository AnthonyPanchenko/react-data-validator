import './drag-and-drop-sorting.scss';

import { useCallback, useRef, useState } from 'react';

type PropsTypes = {
  index: number;
  className?: string;
  children?: React.ReactNode | React.ReactNode[] | null;
  onRegisterDragItem:
    | ((
        setPosition: (posY: number) => void,
        setActiveState: (isActive: boolean) => void,
        event: MouseEvent | Touch,
        index: number
      ) => void)
    | undefined;
};

export default function DragAndDropSortingSource({
  children,
  className,
  index,
  onRegisterDragItem
}: PropsTypes) {
  const [isActive, setActiveState] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const elementWidth = useRef<number>(100);

  const onMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (typeof onRegisterDragItem === 'function' && elementRef.current) {
      elementWidth.current = elementRef.current.clientWidth;
      onRegisterDragItem(setPosition, setActiveState, event as unknown as MouseEvent, index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (typeof onRegisterDragItem === 'function' && elementRef.current) {
      elementWidth.current = elementRef.current.clientWidth;
      onRegisterDragItem(setPosition, setActiveState, event.touches[0] as Touch, index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let currentClassName = 'dnd-source';

  if (className) {
    currentClassName += ' ' + className;
  }

  if (isActive) {
    currentClassName += ' ' + 'active';
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={elementRef}
      style={
        {
          '--cord-y': position + 'px',
          '--width': elementWidth.current + 'px'
        } as React.CSSProperties
      }
      className={currentClassName}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {children}
    </div>
  );
}
