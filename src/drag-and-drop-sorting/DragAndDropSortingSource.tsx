import './drag-and-drop-sorting.scss';

import React, { forwardRef, Fragment, Ref, useCallback, useEffect, useRef, useState } from 'react';

import { onRegisterEventInfo, onRegisterStateSetters } from '@/drag-and-drop-sorting/types';

type PropsTypes = {
  index: number;
  className?: string;
  children?: React.ReactNode | React.ReactNode[] | null;
  onRegisterEventInfo: onRegisterEventInfo;
  onRegisterStateSetters: onRegisterStateSetters;
};

export default function DragAndDropSortingSource({
  children,
  className,
  index,
  onRegisterStateSetters,
  onRegisterEventInfo
}: PropsTypes) {
  const [isActive, setActiveState] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [translatePosition, setTranslatePosition] = useState<number>(0);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const elementWidth = useRef<number>(100);

  useEffect(() => {
    if (onRegisterStateSetters) {
      onRegisterStateSetters(setPosition, setActiveState, setTranslatePosition, index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, onRegisterStateSetters]);

  const onMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!!onRegisterEventInfo && elementRef.current) {
      const elementDomRect = elementRef.current.getBoundingClientRect();
      elementWidth.current = elementDomRect.width;
      onRegisterEventInfo(index, event as unknown as MouseEvent, elementDomRect);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let currentClassName = 'dnd-source';

  if (className) {
    currentClassName += ' ' + className;
  }

  return (
    <Fragment>
      {isActive && (
        <DragAndDropBaseSource
          styles={
            {
              '--cord-top-y': position + 'px',
              '--width': elementWidth.current + 'px'
            } as React.CSSProperties
          }
          className={currentClassName + ' active'}
        >
          {children}
        </DragAndDropBaseSource>
      )}
      <DragAndDropBaseSource
        ref={elementRef}
        index={index}
        styles={
          {
            '--cord-translate-y': translatePosition + 'px'
          } as React.CSSProperties
        }
        className={isActive ? currentClassName + ' inactive' : currentClassName}
        onMouseDown={onMouseDown}
      >
        {children}
      </DragAndDropBaseSource>
    </Fragment>
  );
}

type DnDBaseSourcePropsTypes = {
  className?: string;
  index?: number;
  children?: React.ReactNode | React.ReactNode[] | null;
  styles?: React.CSSProperties;
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const DragAndDropBaseSourceContainer = (
  { children, className, styles, index, onMouseDown }: DnDBaseSourcePropsTypes,
  ref?: Ref<HTMLDivElement>
) => (
  <div ref={ref} style={styles} className={className} data-source-index={index}>
    <span role="button" className="drag-handler" tabIndex={0} onMouseDown={onMouseDown}>
      <svg viewBox="0 0 11 17" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 12.484c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609Zm0-6c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609Zm0-1.968c-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406C7.5.689 7.969.486 8.5.486c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609ZM2.5.484c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406C1.5.687 1.969.484 2.5.484Zm0 6c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609ZM4.516 14.5c0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609C.689 15.5.486 15.032.486 14.5c0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609.532 0 1 .203 1.406.609.406.406.609.875.609 1.406Z" />
      </svg>
    </span>
    {children}
  </div>
);

const DragAndDropBaseSource = forwardRef(DragAndDropBaseSourceContainer);
