// http://localhost:3000/testreport/?sp=9&ifid=ToolsReport&pid=18230
import OtherKeyData from "./NewSampleData.json";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import NewSampleReport from "./NewSampleReport";

export default function NewFirstSample() {
  const onDragEnd = () => {};
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <NewSampleReport OtherKeyData={OtherKeyData} mode={'finishgoodsreport'}/>
    </DragDropContext>
  );
}