import { useAuth } from "@/auth/useAuth";
import api from "@/axios/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: "", middleName: "", lastName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function openEdit() {
    setForm({ firstName: user?.firstName ?? "", middleName: user?.middleName ?? "", lastName: user?.lastName ?? "" });
    setError("");
    setOpen(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", form);
      setUser(data);
      setOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Update failed");
    } finally {
      setLoading(false);
    }
  }

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#09453b] tracking-wide">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information.</p>
      </div>

      <Card className="shadow-none rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                {initials}
              </div>
              <div>
                <CardTitle className="text-lg">
                  {user?.firstName} {user?.lastName}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button size="sm" onClick={openEdit}>
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="First Name" value={user?.firstName} />
            {user?.middleName && <Field label="Middle Name" value={user.middleName} />}
            <Field label="Last Name" value={user?.lastName} />
            <Field label="Email" value={user?.email} />
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" name="middleName" value={form.middleName} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="profile-form" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-base font-medium">{value ?? "—"}</p>
    </div>
  );
}
