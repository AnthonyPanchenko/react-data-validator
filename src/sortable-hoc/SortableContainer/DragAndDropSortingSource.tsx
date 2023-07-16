import './drag-and-drop-sorting.scss';

import React, { forwardRef, Fragment, Ref, useContext, useEffect, useRef, useState } from 'react';

import { getDraggableSortableNode } from '@/sortable-hoc/getDraggableSortableNode';
import { DragAndDropSortingContext } from '@/sortable-hoc/SortableContainer/drag-and-drop-sorting-context';
import { Coordinates } from '@/sortable-hoc/types';

type PropsTypes = {
  className?: string;
  index: number;
  label: string;
  children: React.ReactNode | React.ReactNode[] | null;
};

export default function DragAndDropSortingSource({
  children,
  className,
  index,
  label
}: PropsTypes) {
  const sortingContext = useContext(DragAndDropSortingContext);
  const sortableNodeRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setActiveNodeState] = useState<boolean>(false);
  const [position, setNodePosition] = useState<Coordinates | null>(null);
  const [helperPosition, setHelperNodePosition] = useState<Coordinates>({
    x: 0,
    y: 0
  });

  useEffect(() => {
    if (sortableNodeRef.current) {
      // if (!!position.x || !!position.y) {
      //   setNodePosition({ x: 0, y: 0 });
      // }
      const node = getDraggableSortableNode(
        sortableNodeRef.current,
        label,
        index,
        setNodePosition,
        setActiveNodeState,
        setHelperNodePosition
      );

      sortingContext.registerSortableNode(node);
      // console.log('registerSortableNode: ', node);
    }

    return () => {
      setNodePosition(null);
      // console.log('unRegisterSortableNode: ', index);
      // sortingContext.unRegisterSortableNode(index);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

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
            transform: position ? `translate(${position.x}px, ${position.y}px)` : 'unset',
            transition: position ? 'transform 100ms linear' : 'unset'
          } as React.CSSProperties
        }
        className={isActive ? currentClassName + ' inactive' : currentClassName}
        onMouseDown={event => {
          if (sortableNodeRef.current && !shouldCancelStart(event as unknown as MouseEvent)) {
            const node = getDraggableSortableNode(
              sortableNodeRef.current,
              label,
              index,
              setNodePosition,
              setActiveNodeState,
              setHelperNodePosition
            );
            sortingContext.onStartDrag(node, event as unknown as MouseEvent, sortableNodeRef);
          }
        }}
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

const interactiveElements = ['A', 'BUTTON', 'CANVAS', 'INPUT', 'OPTION', 'TEXTAREA', 'SELECT'];

function shouldCancelStart(event: MouseEvent | TouchEvent) {
  return (
    (event as MouseEvent).button === 2 ||
    interactiveElements.indexOf(((event as MouseEvent).target as HTMLElement)?.tagName) !== -1
  );
}

/*
   if (!isTouchEvent(event) && event.target.tagName === NodeType.Anchor) {
        event.preventDefault();
      }

      if (this.props.pressDelay === 0) {
        this.onStartDrag(event);
      } else {
        this.pressTimer = setTimeout(() => this.onStartDrag(event), this.props.pressDelay);
      }
*/
