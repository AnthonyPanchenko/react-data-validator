import * as React from 'react';

export type Axis = 'x' | 'y' | 'xy';

export type Offset = number | string;

export interface ClientRect {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export type DnDSortingValues = {
  isMoving: boolean;
  activeIndex: number;
  index: number;
  overIndex: number;
  sourceKey: string;
  direction: Direction;
  containerScroll: Position;
  deltaRects: Position;
  startPosition: Coordinates;
  deltaPosition: Coordinates;
  containerRect: DOMRect | null;
  sourceOffsets: Offsets;
  containerScrollOffsets: Coordinates;
  sourceScrollOffsets: Coordinates;
  edgeOffsets: Offsets;
  activeNodeRect: DOMRect | null;
  registeredItems: Record<string, SortingItemsData>;
};

export type SortingItemsData = {
  setListRelatedPosition: (cords: Coordinates) => void;
  setActiveSourceState: (isActive: boolean) => void;
  setHelperNodePosition: (cords: Coordinates) => void;
  domRect: DOMRect;
};

export type Coordinates = {
  x: number;
  y: number;
};

export type Offsets = {
  top: number;
  left: number;
};

export type Position = Offsets;

export interface SortStart {
  node: Element;
  index: number;
  collection: Offset;
  isKeySorting: boolean;
  nodes: HTMLElement[];
  helper: HTMLElement;
}

export interface SortOver {
  index: number;
  oldIndex: number;
  newIndex: number;
  collection: Offset;
  isKeySorting: boolean;
  nodes: HTMLElement[];
  helper: HTMLElement;
}

export interface SortEnd {
  oldIndex: number;
  newIndex: number;
  collection: Offset;
  isKeySorting: boolean;
  nodes: HTMLElement[];
}

export type SortEvent = React.MouseEvent<any> | React.TouchEvent<any>;

export type SortEventWithTag = SortEvent & {
  target: {
    tagName: string;
  };
};

export type SortStartHandler = (sort: SortStart, event: SortEvent) => void;

export type SortMoveHandler = (event: SortEvent) => void;

export type SortEndHandler = (sort: SortEnd, event: SortEvent) => void;

export type SortOverHandler = (sort: SortOver, event: SortEvent) => void;

export type ContainerGetter = (
  element: React.ReactElement<any>
) => HTMLElement | Promise<HTMLElement>;

export type HelperContainerGetter = () => HTMLElement;

export interface Dimensions {
  width: number;
  height: number;
}

export interface SortableContainerProps {
  axis?: Axis;
  transitionDuration?: number;
  pressDelay?: number;
  pressThreshold?: number;
  shouldCancelStart?: (event: SortEvent | SortEventWithTag) => boolean;
  onSortMove?: SortMoveHandler;
  onSortEnd?: SortEndHandler;
  useDragHandle?: boolean;
  useWindowAsScrollContainer?: boolean;
  getContainer?: ContainerGetter;
  getHelperDimensions?: (sort: SortStart) => Dimensions;
  helperContainer?: HTMLElement | HelperContainerGetter;
}

export interface SortableElementProps {
  index: number;
  collection?: Offset;
  disabled?: boolean;
}

export interface Config {
  withRef: boolean;
}

export type WrappedComponentFactory<P> = (props: P) => JSX.Element;

export type WrappedComponent<P> =
  | React.ComponentClass<P>
  | React.SFC<P>
  | WrappedComponentFactory<P>;

export function SortableContainer<P>(
  wrappedComponent: WrappedComponent<P>,
  config?: Config
): React.ComponentClass<P & SortableContainerProps>;

export function SortableElement<P>(
  wrappedComponent: WrappedComponent<P>,
  config?: Config
): React.ComponentClass<P & SortableElementProps>;

export function SortableHandle<P>(
  wrappedComponent: WrappedComponent<P>,
  config?: Config
): React.ComponentClass<P>;

export function arrayMove<T>(collection: T[], previousIndex: number, newIndex: number): T[];
