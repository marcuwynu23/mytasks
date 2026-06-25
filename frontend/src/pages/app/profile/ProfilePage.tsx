import { useAuth } from "@/auth/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {user?.name && <p><span className="font-medium">Name:</span> {user.name}</p>}
          <p><span className="font-medium">Email:</span> {user?.email}</p>
        </CardContent>
      </Card>
    </div>
  );
}
