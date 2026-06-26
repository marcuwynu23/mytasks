import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Stats = { total: number; completed: number; pending: number };

export function StatsCards({ stats }: { stats: Stats }) {
  const items = [
    { label: "Total Tasks", value: stats.total, color: "text-primary" },
    { label: "Completed", value: stats.completed, color: "text-emerald-500" },
    { label: "Pending", value: stats.pending, color: "text-amber-500" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map(({ label, value, color }) => (
        <Card key={label} className="shadow-none rounded-2xl border ring-0">
          <CardHeader className="pb-1 pt-5">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center">{label}</CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <p className={`text-4xl font-extrabold text-center ${color}`}>{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
