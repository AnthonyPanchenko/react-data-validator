import { useContext, useEffect, useRef } from 'react';

import { DragAndDropContext } from '@/drag-and-drop/drag-and-drop-context';

export default function useDragAndDropArea() {
  const dndAreaRef = useRef<HTMLDivElement | null>(null);
  const ctx = useContext(DragAndDropContext);

  useEffect(() => {
    console.log(dndAreaRef.current);
  }, []);

  console.log('useDragAndDropArea render analyzer:');

  return [dndAreaRef];
}
