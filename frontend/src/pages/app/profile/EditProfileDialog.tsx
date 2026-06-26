import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Form = { firstName: string; middleName: string; lastName: string };

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  form: Form;
  onChange: (f: Form) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string;
  loading: boolean;
}

export function EditProfileDialog({ open, onOpenChange, form, onChange, onSubmit, error, loading }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
        <form id="profile-form" onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={form.firstName} onChange={(e) => onChange({ ...form, firstName: e.target.value })} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="middleName">Middle Name</Label>
            <Input id="middleName" value={form.middleName} onChange={(e) => onChange({ ...form, middleName: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={form.lastName} onChange={(e) => onChange({ ...form, lastName: e.target.value })} required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="profile-form" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
