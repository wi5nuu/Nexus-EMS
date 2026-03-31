"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Task } from "./KanbanBoard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanTask } from "./KanbanTask";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: column.id,
    data: { type: "Column", column },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex flex-col bg-card/50 border border-border/50 rounded-2xl w-[320px] flex-shrink-0 h-full overflow-hidden shadow-sm"
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="p-4 border-b border-border/50 bg-white/5 cursor-grab active:cursor-grabbing flex items-center justify-between"
      >
        <span className="font-syne font-semibold text-sm">{column.title}</span>
        <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto overflow-x-hidden flex flex-col gap-3">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanTask key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
