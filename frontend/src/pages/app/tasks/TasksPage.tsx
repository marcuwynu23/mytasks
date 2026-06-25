import api from "@/axios/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
};

const EMPTY = { title: "", description: "" };

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const load = () => api.get("/tasks").then(({ data }) => setTasks(data));
  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(t: Task) {
    setEditing(t);
    setForm({ title: t.title, description: t.description });
    setOpen(true);
  }

  async function save() {
    if (editing) {
      await api.put(`/tasks/${editing._id}`, form);
    } else {
      await api.post("/tasks", form);
    }
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
    await api.put(`/tasks/${t._id}`, {
      status: t.status === "completed" ? "pending" : "completed",
    });
    load();
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <Button onClick={openCreate}>New Task</Button>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 && <p className="text-muted-foreground text-sm">No tasks yet.</p>}
        {tasks.map((t) => (
          <Card key={t._id}>
            <CardContent className="flex items-start gap-3 p-3">
              <Checkbox id={`task-${t._id}`} checked={t.status === "completed"} onCheckedChange={() => toggle(t)} className="mt-1" />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor={`task-${t._id}`}
                  className={`font-medium cursor-pointer ${t.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                >
                  {t.title}
                </label>
                {t.description && <p className="text-sm text-muted-foreground truncate">{t.description}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={t.status === "completed" ? "secondary" : "outline"}>{t.status}</Badge>
                <Button size="sm" variant="outline" onClick={() => openEdit(t)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(t)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Task" : "New Task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <Textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={!form.title}>
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
            <DialogDescription>
              <strong>"{deleteTarget?.title}"</strong> will be permanently removed. This can't be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
