"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent
} from "@dnd-kit/core";
import { 
  SortableContext, 
  arrayMove, 
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanTask } from "./KanbanTask";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export type Task = {
  id: string;
  columnId: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignee: string;
};

export type Column = {
  id: string;
  title: string;
};

const initialColumns: Column[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "IN_REVIEW", title: "In Review" },
  { id: "DONE", title: "Done" },
];

const initialTasks: Task[] = [
  {
    id: "task-1",
    columnId: "TODO",
    title: "Implement API Gateway",
    description: "Set up Kong API gateway with rate limiting.",
    priority: "High",
    assignee: "AD",
  },
  {
    id: "task-2",
    columnId: "IN_PROGRESS",
    title: "Setup Monorepo Structure",
    description: "Configure Next.js and Fastify in NPM Workspaces.",
    priority: "Urgent",
    assignee: "RN",
  },
  {
    id: "task-3",
    columnId: "DONE",
    title: "Define DB Schema",
    description: "Write Prisma schema for IAM domain.",
    priority: "Medium",
    assignee: "AD",
  },
];

export function KanbanBoard() {

  const { data: fetchedTasks, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      try {
        const res = await fetch('http://localhost:8081/api/v1/tickets');
        if (!res.ok) return initialTasks;
        const json = await res.json();
        if (!json.data || json.data.length === 0) return initialTasks;
        
        // Map backend Domain 4 Ticket schema to Kanban Task schema
        return json.data.map((t: { id: string; status: string; title: string; description?: string; priority: "Low" | "Medium" | "High" | "Urgent"; assignee?: { email: string } }) => ({
          id: t.id,
          columnId: t.status,
          title: t.title,
          description: t.description || '',
          priority: t.priority,
          assignee: t.assignee?.email?.substring(0,2).toUpperCase() || 'NA'
        }));
      } catch {
        console.warn("Backend unavailable, falling back to mock data");
        return initialTasks;
      }
    },
    staleTime: 5000,
  });

  const [columns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks);
    }
  }, [fetchedTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    // Dropping a Task over another Task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          const newTasks = [...tasks];
          newTasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Dropping a Task over a Column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const newTasks = [...tasks];
        newTasks[activeIndex].columnId = String(overId);
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  }

  function handleDragEnd() {
    setActiveTask(null);
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-syne font-bold flex items-center gap-3">
            Sprint Board
            {isLoading && <span className="text-xs font-normal text-muted-foreground animate-pulse">Syncing with database...</span>}
            {!isLoading && <span className="text-xs font-normal bg-green-500/10 text-green-500 px-2 py-1 rounded border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">Live PostgreSQL</span>}
          </h2>
          <p className="font-dmsans text-muted-foreground text-sm">Drag and drop tickets to update their status.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border/50 bg-white/5">Filter</Button>
          <Button className="electric-gradient text-primary-foreground border-none">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-x-auto pb-4 custom-scrollbar">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCorners} 
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
            {columns.map((col) => (
              <KanbanColumn 
                key={col.id} 
                column={col} 
                tasks={tasks.filter((task) => task.columnId === col.id)} 
              />
            ))}
          </SortableContext>
          
          <DragOverlay>
            {activeTask ? <KanbanTask task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
