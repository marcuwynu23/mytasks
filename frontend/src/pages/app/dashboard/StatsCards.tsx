import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Stats = { total: number; completed: number; pending: number };

export function StatsCards({ stats }: { stats: Stats }) {
  const items = [
    { label: "Total Tasks", value: stats.total },
    { label: "Completed", value: stats.completed },
    { label: "Pending", value: stats.pending },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {items.map(({ label, value }) => (
        <Card key={label} className="shadow-none rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">{label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-center">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
