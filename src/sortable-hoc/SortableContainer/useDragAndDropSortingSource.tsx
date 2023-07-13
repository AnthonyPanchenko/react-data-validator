import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { getDraggableSortableNode } from '@/sortable-hoc/getDraggableSortableNode';
import { DragAndDropSortingContext } from '@/sortable-hoc/SortableContainer/drag-and-drop-sorting-context';
import { Coordinates } from '@/sortable-hoc/types';

export default function useDragAndDropSortingSource<TElement extends HTMLElement>(
  index: number
): [
  React.MutableRefObject<TElement | null>,
  Coordinates,
  Coordinates,
  boolean,
  (event: React.MouseEvent<TElement>) => void
] {
  const sortingContext = useContext(DragAndDropSortingContext);
  const [isActive, setActiveNodeState] = useState<boolean>(false);
  const [offsetPosition, setNodePosition] = useState<Coordinates>({ x: 0, y: 0 });
  const [helperPosition, setHelperNodePosition] = useState<Coordinates>({
    x: 0,
    y: 0
  });

  const sortableNodeRef = useRef<TElement | null>(null);

  useEffect(() => {
    if (sortableNodeRef.current) {
      const node = getDraggableSortableNode(
        sortableNodeRef.current,
        index,
        setNodePosition,
        setActiveNodeState,
        setHelperNodePosition
      );

      sortingContext.registerSortableNode(node);
      console.log('registerSortableNode: ', node);
    }

    return () => {
      console.log('unRegisterSortableNode: ', index);
      sortingContext.unRegisterSortableNode(index);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const onStartPressElement = useCallback(
    (event: React.MouseEvent<TElement>) => {
      if (sortableNodeRef.current && !shouldCancelStart(event as unknown as MouseEvent)) {
        const node = getDraggableSortableNode(
          sortableNodeRef.current,
          index,
          setNodePosition,
          setActiveNodeState,
          setHelperNodePosition
        );
        sortingContext.onStartDrag(event as unknown as MouseEvent, node, sortableNodeRef);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return [sortableNodeRef, helperPosition, offsetPosition, isActive, onStartPressElement];
}

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
