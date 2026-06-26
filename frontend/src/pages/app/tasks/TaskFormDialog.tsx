import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Form = { title: string; description: string };

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: boolean;
  form: Form;
  onChange: (form: Form) => void;
  onSave: () => void;
}

export function TaskFormDialog({ open, onOpenChange, editing, form, onChange, onSave }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <form id="task-form" onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Task title" value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value })} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Optional description" value={form.description} onChange={(e) => onChange({ ...form, description: e.target.value })} />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="task-form" disabled={!form.title}>{editing ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
