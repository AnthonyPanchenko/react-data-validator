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
        index: number,
        elementClientRect: DOMRect
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
      const elementClientRect = elementRef.current.getBoundingClientRect();
      elementWidth.current = elementClientRect.width;
      console.log(elementClientRect);
      onRegisterDragItem(
        setPosition,
        setActiveState,
        event as unknown as MouseEvent,
        index,
        elementClientRect
      );
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
    <div
      ref={elementRef}
      style={
        {
          '--cord-y': position + 'px',
          '--width': elementWidth.current + 'px'
        } as React.CSSProperties
      }
      className={currentClassName}
    >
      <span role="button" className="drag-handler" tabIndex={0} onMouseDown={onMouseDown}>
        <svg viewBox="0 0 11 17" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 12.484c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609Zm0-6c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609Zm0-1.968c-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406C7.5.689 7.969.486 8.5.486c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609ZM2.5.484c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406C1.5.687 1.969.484 2.5.484Zm0 6c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609ZM4.516 14.5c0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609C.689 15.5.486 15.032.486 14.5c0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609.532 0 1 .203 1.406.609.406.406.609.875.609 1.406Z" />
        </svg>
      </span>
      {children}
    </div>
  );
}
