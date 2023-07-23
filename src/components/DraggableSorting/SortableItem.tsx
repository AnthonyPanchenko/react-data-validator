import { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import React from 'react';

type PropsType = {
  attributes?: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
  containerId: string;
  children: React.ReactNode | React.ReactNode[] | string | null;
};

// className={classNames(
//   styles.Wrapper,
//   styles.Actions,
//   fadeIn && styles.fadeIn,
//   sorting && styles.sorting,
//   dragOverlay && styles.dragOverlay,
//   styles.Item,
//   dragging && styles.dragging,
//   handle && styles.withHandle,
//   dragOverlay && styles.dragOverlay,
//   disabled && styles.disabled,
//   color && styles.color
// )}

function SortableItem(
  {
    attributes = {} as DraggableAttributes,
    listeners = {},
    style,
    children,
    containerId
  }: PropsType,
  ref?: React.LegacyRef<HTMLLIElement>
) {
  const className = `draggable-item ${containerId === 'active' ? 'active' : 'inactive'}`;
  return (
    <li ref={ref} {...attributes} {...listeners} className={className} style={style}>
      <svg className="handler" viewBox="0 0 11 17" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 12.484c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609Zm0-6c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609Zm0-1.968c-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406C7.5.689 7.969.486 8.5.486c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609ZM2.5.484c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406C1.5.687 1.969.484 2.5.484Zm0 6c.532 0 1 .203 1.406.609.406.406.609.875.609 1.406 0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609-.406-.406-.609-.874-.609-1.406 0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609ZM4.516 14.5c0 .532-.203 1-.609 1.406-.406.406-.874.609-1.406.609-.531 0-1-.203-1.406-.609C.689 15.5.486 15.032.486 14.5c0-.531.203-1 .609-1.406.406-.406.875-.609 1.406-.609.532 0 1 .203 1.406.609.406.406.609.875.609 1.406Z" />
      </svg>

      {children}
    </li>
  );
}

export default React.forwardRef<HTMLLIElement, PropsType>(SortableItem);
