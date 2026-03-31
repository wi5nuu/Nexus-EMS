import { KanbanBoard } from "@/components/dashboard/KanbanBoard";

export default function ProjectBoardPage() {
  return (
    <div className="h-[calc(100vh-6rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <KanbanBoard />
    </div>
  );
}
