import { useRef } from 'react';

export default function useDragAndDropArea() {
  const dndAreaRef = useRef<HTMLDivElement | null>(null);

  console.log('useDragAndDropArea render analyzer:');

  return [dndAreaRef];
}
