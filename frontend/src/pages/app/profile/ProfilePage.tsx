import { useState } from "react";
import { useAuth } from "@/auth/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/axios/axios";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: user?.firstName ?? "", middleName: user?.middleName ?? "", lastName: user?.lastName ?? "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setEditing(false);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          {!editing ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">First Name:</span> {user?.firstName}</p>
              {user?.middleName && <p><span className="font-medium">Middle Name:</span> {user.middleName}</p>}
              <p><span className="font-medium">Last Name:</span> {user?.lastName}</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <Button className="mt-4 w-full" onClick={() => { setForm({ firstName: user?.firstName ?? "", middleName: user?.middleName ?? "", lastName: user?.lastName ?? "" }); setEditing(true); }}>
                Edit Profile
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="middleName">Middle Name</Label>
                <Input id="middleName" name="middleName" value={form.middleName} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-2 pt-1">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
