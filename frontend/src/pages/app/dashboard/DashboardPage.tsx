import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/axios/axios";

type Stats = { total: number; completed: number; pending: number };

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, pending: 0 });

  useEffect(() => {
    api.get("/tasks").then(({ data }) => {
      const total = data.length;
      const completed = data.filter((t: any) => t.status === "completed").length;
      setStats({ total, completed, pending: total - completed });
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Tasks" value={stats.total} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Pending" value={stats.pending} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
