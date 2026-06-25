import { useState } from "react";
import { useAuth } from "@/auth/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import api from "@/axios/axios";

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

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Information</CardTitle>
          <Button size="sm" onClick={openEdit}>Edit Profile</Button>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <div>
              <p className="text-muted-foreground">First Name</p>
              <p className="font-medium">{user?.firstName}</p>
            </div>
            {user?.middleName && (
              <div>
                <p className="text-muted-foreground">Middle Name</p>
                <p className="font-medium">{user.middleName}</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground">Last Name</p>
              <p className="font-medium">{user?.lastName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
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
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="profile-form" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
