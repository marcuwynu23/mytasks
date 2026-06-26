import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export type Task = { _id: string; title: string; description: string; status: "pending" | "completed"; dueDate?: string };

interface Props {
  tasks: Task[];
  filtered: Task[];
  paginated: Task[];
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onToggle: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
}

export function TaskList({ tasks, filtered, paginated, page, totalPages, onPageChange, onToggle, onEdit, onDelete }: Props) {
  return (
    <Card className="shadow-none rounded-2xl border-0 ring-0">
      <CardContent className="pt-0 p-0">
        <div className="overflow-y-auto max-h-[420px] px-6 scrollbar-primary">
          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-1">
              <p className="text-base font-medium">No tasks yet</p>
              <p className="text-sm text-muted-foreground">
                Click <strong>New Task</strong> to get started.
              </p>
            </div>
          )}
          {tasks.length > 0 && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-1">
              <p className="text-base font-medium">No matching tasks</p>
              <p className="text-sm text-muted-foreground">Try a different search term or filter.</p>
            </div>
          )}
          {paginated.map((t) => (
            <div key={t._id} className="py-3 border-b last:border-0">
              <div className="flex items-start gap-3">
                <Checkbox id={`task-${t._id}`} checked={t.status === "completed"} onCheckedChange={() => onToggle(t)} className="mt-0.5" />
                <Badge variant={t.status === "completed" ? "secondary" : "outline"} className="mt-0.5 shrink-0">
                  {t.status}
                </Badge>
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={`task-${t._id}`}
                    className={`text-sm sm:text-base font-medium cursor-pointer truncate block ${t.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                  >
                    {t.title}
                  </label>
                  {t.description && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">{t.description}</p>}
                  {t.dueDate && <p className="text-xs text-muted-foreground mt-0.5">Due: {new Date(t.dueDate).toLocaleDateString()}</p>}
                </div>
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => onEdit(t)}>
                    Edit
                  </Button>
                  <Button size="sm" onClick={() => onDelete(t)}>
                    Delete
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:hidden">
                <Button size="sm" variant="outline" onClick={() => onEdit(t)} className="flex-1">
                  Edit
                </Button>
                <Button size="sm" onClick={() => onDelete(t)} className="flex-1">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="border-t px-6 py-3">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    aria-disabled={page === 1}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm text-muted-foreground px-2">
                    Page {page} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    aria-disabled={page === totalPages}
                    className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
