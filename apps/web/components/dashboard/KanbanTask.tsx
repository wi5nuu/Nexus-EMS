"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./KanbanBoard";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface KanbanTaskProps {
  task: Task;
}

export function KanbanTask({ task }: KanbanTaskProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const priorityColors = {
    Low: "bg-blue-500/10 text-blue-500",
    Medium: "bg-amber-500/10 text-amber-500",
    High: "bg-orange-500/10 text-orange-500",
    Urgent: "bg-red-500/10 text-red-500",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "p-4 rounded-xl border border-border/50 bg-card shadow-sm cursor-grab active:cursor-grabbing group hover:border-primary/50 transition-colors flex flex-col gap-3",
        isDragging && "opacity-50 border-primary"
      )}
    >
      <div className="flex justify-between items-start">
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
          priorityColors[task.priority]
        )}>
          {task.priority}
        </span>
        <span className="text-xs text-muted-foreground font-jetbrains">{task.id}</span>
      </div>
      
      <div>
        <h4 className="font-syne font-semibold text-sm leading-tight">{task.title}</h4>
        <p className="font-dmsans text-xs text-muted-foreground mt-1 line-clamp-2">
          {task.description}
        </p>
      </div>
      
      <div className="flex justify-end mt-2">
        <Avatar className="h-6 w-6 border-2 border-background">
          <AvatarFallback className="text-[10px] bg-primary/20 text-primary font-bold">
            {task.assignee}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
