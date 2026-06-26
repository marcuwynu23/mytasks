import { useAuth } from "@/auth/useAuth";
import api from "@/axios/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { changePasswordSchema, profileSchema } from "@/lib/validations";
import { useState } from "react";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { EditProfileDialog } from "./EditProfileDialog";

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

    const result = profileSchema.safeParse(editForm);
    if (!result.success) {
      setEditError(result.error.issues.map((i) => i.message).join(", "));
      return;
    }

    setEditLoading(true);
    try {
      const { data } = await api.put("/auth/profile", result.data);
      setUser(data);
      setEditOpen(false);
    } catch (err) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setEditError(axiosErr.response?.data?.message ?? axiosErr.message ?? "Update failed");
    } finally {
      setEditLoading(false);
    }
  }

  async function handlePwSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");

    const result = changePasswordSchema.safeParse(pwForm);
    if (!result.success) {
      setPwError(result.error.issues.map((i) => i.message).join(", "));
      return;
    }

    setPwLoading(true);
    try {
      await api.put("/auth/password", result.data);
      setPwOpen(false);
    } catch (err) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setPwError(axiosErr.response?.data?.message ?? axiosErr.message ?? "Failed to change password");
    } finally {
      setPwLoading(false);
    }
  }

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <div>
        <h1 className="text-xl sm:text-xl font-bold tracking-wide">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information.</p>
      </div>

      <Card className="shadow-none rounded-2xl border-0 ring-0">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              <Button size="sm" variant="outline" onClick={openChangePassword}>
                Change Password
              </Button>
              <Button size="sm" onClick={openEdit}>
                Edit Profile
              </Button>
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

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        form={editForm}
        onChange={setEditForm}
        onSubmit={handleEditSubmit}
        error={editError}
        loading={editLoading}
      />
      <ChangePasswordDialog
        open={pwOpen}
        onOpenChange={setPwOpen}
        form={pwForm}
        onChange={setPwForm}
        onSubmit={handlePwSubmit}
        error={pwError}
        loading={pwLoading}
      />
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
