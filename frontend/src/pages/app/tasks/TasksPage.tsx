import api from "@/axios/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
};

const EMPTY = { title: "", description: "" };
const PAGE_SIZE = 8;

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const load = () => api.get("/tasks").then(({ data }) => setTasks(data));
  useEffect(() => { load(); }, []);

  const filtered = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || t.status === filter;
    return matchesSearch && matchesFilter;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openCreate() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(t: Task) { setEditing(t); setForm({ title: t.title, description: t.description }); setOpen(true); }

  async function save() {
    if (editing) await api.put(`/tasks/${editing._id}`, form);
    else await api.post("/tasks", form);
    setOpen(false);
    load();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await api.delete(`/tasks/${deleteTarget._id}`);
    setDeleteTarget(null);
    load();
  }

  async function toggle(t: Task) {
    await api.put(`/tasks/${t._id}`, { status: t.status === "completed" ? "pending" : "completed" });
    load();
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track your tasks.</p>
        </div>
        <Button size="sm" onClick={openCreate}>New Task</Button>
      </div>

      <div className="flex justify-end gap-3">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-sm"
        />
        <Select value={filter} onValueChange={(v) => { setFilter(v as typeof filter); setPage(1); }}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-none rounded-2xl">
        <CardHeader className="pb-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">All Tasks</p>
        </CardHeader>
        <CardContent className="pt-0 p-0">
          <div className="overflow-y-auto max-h-[420px] px-6 scrollbar-primary">
            {tasks.length === 0 && <p className="text-sm text-muted-foreground py-3">No tasks yet.</p>}
            {tasks.length > 0 && filtered.length === 0 && <p className="text-sm text-muted-foreground py-3">No tasks match your search.</p>}
            {paginated.map((t) => (
              <div key={t._id} className="flex items-start gap-3 py-3 border-b last:border-0">
                <Checkbox id={`task-${t._id}`} checked={t.status === "completed"} onCheckedChange={() => toggle(t)} className="mt-0.5" />
                <Badge variant={t.status === "completed" ? "secondary" : "outline"} className="mt-0.5 shrink-0">{t.status}</Badge>
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={`task-${t._id}`}
                    className={`text-base font-medium cursor-pointer ${t.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                  >
                    {t.title}
                  </label>
                  {t.description && <p className="text-sm text-muted-foreground mt-0.5 truncate">{t.description}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => openEdit(t)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(t)}>Delete</Button>
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
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Task" : "New Task"}</DialogTitle>
          </DialogHeader>
          <form id="task-form" onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Task title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Optional description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="task-form" disabled={!form.title}>{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
            <DialogDescription>
              <strong>"{deleteTarget?.title}"</strong> will be permanently removed. This can't be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
