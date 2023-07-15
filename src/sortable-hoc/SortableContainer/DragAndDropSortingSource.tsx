import './drag-and-drop-sorting.scss';

import React, { forwardRef, Fragment, Ref } from 'react';

import useDragAndDropSortingSource from '@/sortable-hoc/SortableContainer/scroll/useDragAndDropSortingSource';

type PropsTypes = {
  className?: string;
  index: number;
  children: React.ReactNode | React.ReactNode[] | null;
};

export default function DragAndDropSortingSource({ children, className, index }: PropsTypes) {
  const [sortableNodeRef, helperPosition, position, isActive, onStartPressElement] =
    useDragAndDropSortingSource<HTMLDivElement>(index);

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
              top: `${helperPosition.y}px`,
              left: `${helperPosition.x}px`,
              width: `${sortableNodeRef.current?.offsetWidth}px`,
              height: `${sortableNodeRef.current?.offsetHeight}px`
            } as React.CSSProperties
          }
          className={currentClassName + ' active'}
        >
          {children}
        </DragAndDropBaseSource>
      )}
      <DragAndDropBaseSource
        ref={sortableNodeRef}
        styles={
          {
            transform: `translate(${position.x}px, ${position.y}px)`
          } as React.CSSProperties
        }
        className={isActive ? currentClassName + ' inactive' : currentClassName}
        onMouseDown={onStartPressElement}
      >
        {children}
      </DragAndDropBaseSource>
    </Fragment>
  );
}

type DnDBaseSourcePropsTypes = {
  className?: string;
  styles?: React.CSSProperties;
  children?: React.ReactNode | ReadonlyArray<React.ReactNode> | null;
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const DragAndDropBaseSourceContainer = (
  { children, className, styles, onMouseDown }: DnDBaseSourcePropsTypes,
  ref?: Ref<HTMLDivElement>
) => (
  <div ref={ref} style={styles} className={className}>
    <span role="button" className="drag-handler" tabIndex={0} onMouseDown={onMouseDown}>
      <svg viewBox="0 0 11 17" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 12.484c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609Zm0-6c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609Zm0-1.968c-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406C7.5.689 7.969.486 8.5.486c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609ZM2.5.484c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406C1.5.687 1.969.484 2.5.484Zm0 6c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609ZM4.516 14.5c0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609C.689 15.5.486 15.032.486 14.5c0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609.532 0 1 .203 1.406.609.406.406.609.875.609 1.406Z" />
      </svg>
    </span>
    {children}
  </div>
);

const DragAndDropBaseSource = forwardRef(DragAndDropBaseSourceContainer);
