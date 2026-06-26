import api from "@/axios/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { taskSchema } from "@/lib/validations";
import { useEffect, useState } from "react";
import { TaskDeleteDialog } from "./TaskDeleteDialog";
import { TaskFormDialog } from "./TaskFormDialog";
import { TaskList, type Task } from "./TaskList";

const EMPTY = { title: "", description: "", dueDate: "" };
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
  useEffect(() => {
    load();
  }, []);

  const filtered = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || t.status === filter;
    return matchesSearch && matchesFilter;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(t: Task) {
    setEditing(t);
    setForm({ title: t.title, description: t.description, dueDate: t.dueDate ?? "" });
    setOpen(true);
  }

  async function save() {
    const payload = { ...form, dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null };
    const result = taskSchema.safeParse(payload);
    if (!result.success) return;
    if (editing) await api.put(`/tasks/${editing._id}`, result.data);
    else await api.post("/tasks", result.data);
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
    <div className="p-4 sm:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-xl font-bold tracking-wide">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track your tasks.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          New Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-sm bg-white border-border focus-visible:ring-0 focus-visible:border-border"
        />
        <Select
          value={filter}
          onValueChange={(v) => {
            setFilter(v as typeof filter);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-36 bg-white border-border focus-visible:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TaskList
        tasks={tasks}
        filtered={filtered}
        paginated={paginated}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onToggle={toggle}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <TaskFormDialog open={open} onOpenChange={setOpen} editing={!!editing} form={form} onChange={setForm} onSave={save} />

      <TaskDeleteDialog target={deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)} onConfirm={confirmDelete} />
    </div>
  );
}
