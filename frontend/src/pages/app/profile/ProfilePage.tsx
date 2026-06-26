import { useAuth } from "@/auth/useAuth";
import api from "@/axios/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /[0-9]/.test(p) },
  { label: "Symbol (!@#$…)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", middleName: "", lastName: "" });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [pwOpen, setPwOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  function openEdit() {
    setEditForm({ firstName: user?.firstName ?? "", middleName: user?.middleName ?? "", lastName: user?.lastName ?? "" });
    setEditError("");
    setEditOpen(true);
  }

  function openChangePassword() {
    setPwForm({ currentPassword: "", newPassword: "" });
    setPwError("");
    setPwOpen(true);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEditError("");
    setEditLoading(true);
    try {
      const { data } = await api.put("/auth/profile", editForm);
      setUser(data);
      setEditOpen(false);
    } catch (err: any) {
      setEditError(err?.response?.data?.message ?? "Update failed");
    } finally {
      setEditLoading(false);
    }
  }

  async function handlePwSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwLoading(true);
    try {
      await api.put("/auth/password", pwForm);
      setPwOpen(false);
    } catch (err: any) {
      setPwError(err?.response?.data?.message ?? "Failed to change password");
    } finally {
      setPwLoading(false);
    }
  }

  const allRulesPassed = PASSWORD_RULES.every(({ test }) => test(pwForm.newPassword));
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-wide">Profile</h1>
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
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={openChangePassword}>Change Password</Button>
              <Button size="sm" onClick={openEdit}>Edit Profile</Button>
            </div>
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

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form id="profile-form" onSubmit={handleEditSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={editForm.firstName} onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" name="middleName" value={editForm.middleName} onChange={(e) => setEditForm((f) => ({ ...f, middleName: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={editForm.lastName} onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))} required />
            </div>
            {editError && <p className="text-sm text-destructive">{editError}</p>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" form="profile-form" disabled={editLoading}>{editLoading ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={pwOpen} onOpenChange={setPwOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form id="pw-form" onSubmit={handlePwSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="currentPassword">Current Password</Label>
              <PasswordInput id="currentPassword" value={pwForm.currentPassword} onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))} required autoComplete="current-password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newPassword">New Password</Label>
              <PasswordInput id="newPassword" value={pwForm.newPassword} onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))} required autoComplete="new-password" />
              {pwForm.newPassword && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PASSWORD_RULES.map(({ label, test }) => (
                    <Badge key={label} variant={test(pwForm.newPassword) ? "default" : "outline"} className="text-xs">
                      {test(pwForm.newPassword) ? "✓" : "✗"} {label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {pwError && <p className="text-sm text-destructive">{pwError}</p>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPwOpen(false)}>Cancel</Button>
            <Button type="submit" form="pw-form" disabled={pwLoading || !allRulesPassed}>{pwLoading ? "Saving..." : "Change Password"}</Button>
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
