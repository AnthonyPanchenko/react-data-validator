import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { DragAndDropSortingContext } from '@/sortable-hoc/SortableContainer/drag-and-drop-sorting-context';
import { Coordinates } from '@/sortable-hoc/types';
import { miniUID } from '@/sortable-hoc/utils';

type CurrentMetaDataType = {
  sourceKye: string;
  rect: DOMRect | null;
};

// const PRESS_DELAY =

// pressDelay: 0,
// pressThreshold: 5,

export default function useDragAndDropSortingSource<TElement extends HTMLElement>(
  currentIndex: number
): [
  string,
  React.MutableRefObject<TElement | null>,
  (event: React.MouseEvent<TElement>) => void,
  boolean,
  Coordinates,
  Coordinates,
  DOMRect | null
] {
  const sortingContext = useContext(DragAndDropSortingContext);
  const [isActive, setActiveSourceState] = useState<boolean>(false);
  const [listRelatedPosition, setListRelatedPosition] = useState<Coordinates>({ x: 0, y: 0 });
  const [globalTranslatePosition, setHelperNodePosition] = useState<Coordinates>({
    x: 0,
    y: 0
  });

  const sourceElementRef = useRef<TElement | null>(null);

  const currentMetaData = useRef<CurrentMetaDataType>({
    sourceKye: '',
    rect: null
  });

  useEffect(() => {
    let constantSourceKye = '';

    if (!currentMetaData.current.sourceKye && !constantSourceKye && sourceElementRef.current) {
      constantSourceKye = miniUID();

      const domRect = sourceElementRef.current.getBoundingClientRect();
      currentMetaData.current.rect = domRect;

      sortingContext.registerStateSetters(
        setListRelatedPosition,
        setActiveSourceState,
        setHelperNodePosition,
        constantSourceKye,
        domRect
      );

      currentMetaData.current.sourceKye = constantSourceKye;
    }

    return () => {
      sortingContext.unRegisterStateSetters(constantSourceKye);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStartPressElement = useCallback(
    (event: React.MouseEvent<TElement>) => {
      if (sourceElementRef.current && !shouldCancelStart(event as unknown as MouseEvent)) {
        const sourceDomRect = sourceElementRef.current.getBoundingClientRect();
        currentMetaData.current.rect = sourceDomRect;
        sortingContext.onStartDrag(
          currentIndex,
          currentMetaData.current.sourceKye,
          event as unknown as MouseEvent,
          sourceDomRect,
          sourceElementRef
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return [
    currentMetaData.current.sourceKye,
    sourceElementRef,
    onStartPressElement,
    isActive,
    listRelatedPosition,
    globalTranslatePosition,
    currentMetaData.current.rect
  ];
}

const interactiveElements = ['A', 'BUTTON', 'CANVAS', 'INPUT', 'OPTION', 'TEXTAREA', 'SELECT'];

function shouldCancelStart(event: MouseEvent | TouchEvent) {
  return (
    (event as MouseEvent).button === 2 ||
    interactiveElements.indexOf(((event as MouseEvent).target as HTMLElement)?.tagName) !== -1
  );
}

/*
   componentDidUpdate(prevProps) {
      if (this.node) {
        if (prevProps.index !== this.props.index) {
          this.node.sortableInfo.index = this.props.index;
        }

        if (prevProps.disabled !== this.props.disabled) {
          this.node.sortableInfo.disabled = this.props.disabled;
        }
      }

      if (prevProps.collection !== this.props.collection) {
        this.unregister(prevProps.collection);
        this.register();
      }
    }

   if (!isTouchEvent(event) && event.target.tagName === NodeType.Anchor) {
        event.preventDefault();
      }

      if (this.props.pressDelay === 0) {
        this.onStartDrag(event);
      } else {
        this.pressTimer = setTimeout(() => this.onStartDrag(event), this.props.pressDelay);
      }
*/
