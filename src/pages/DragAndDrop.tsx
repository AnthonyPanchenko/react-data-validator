import './drag-and-drop.scss';

import DragAndDropContainer from '@/drag-and-drop/DragAndDropContainer';
import useDragAndDropArea from '@/drag-and-drop/useDragAndDropArea';
import DragAndDropArea from '@/pages/DragAndDropArea';
import DragAndDropSource from '@/pages/DragAndDropSource';

export default function DragAndDrop() {
  useDragAndDropArea();

  return (
    <div className="dnd">
      <DragAndDropContainer>
        <DragAndDropArea className="box-1">
          <DragAndDropSource item={1}>1111111</DragAndDropSource>
          <DragAndDropSource item={2}>2222222</DragAndDropSource>
          <DragAndDropSource item={3}>3333333</DragAndDropSource>
          <DragAndDropSource item={4}>4444444</DragAndDropSource>
        </DragAndDropArea>
        <DragAndDropArea className="box-2">
          <DragAndDropSource item={5}>5555555</DragAndDropSource>
          <DragAndDropSource item={6}>6666666</DragAndDropSource>
          <DragAndDropSource item={7}>7777777</DragAndDropSource>
          <DragAndDropSource item={8}>8888888</DragAndDropSource>
        </DragAndDropArea>
      </DragAndDropContainer>
    </div>
  );
}
