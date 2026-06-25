import api from "@/axios/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";

type Stats = { total: number; completed: number; pending: number };
type Quote = { content: string; author: string };

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, pending: 0 });
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    api.get("/tasks").then(({ data }) => {
      const total = data.length;
      const completed = data.filter((t: any) => t.status === "completed").length;
      setStats({ total, completed, pending: total - completed });
    });

    axios
      .get("https://zenquotes.io/api/quotes/")
      .then(({ data }) => setQuote({ content: data[0].q, author: data[0].a }))
      .catch(() => setQuote({ content: "The secret of getting ahead is getting started.", author: "Mark Twain" }));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Tasks" value={stats.total} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Pending" value={stats.pending} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Quote of the Day</CardTitle>
        </CardHeader>
        <CardContent>
          {quote ? (
            <>
              <p className="text-base italic">"{quote.content}"</p>
              <p className="text-sm text-muted-foreground mt-2">— {quote.author}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground animate-pulse">Loading quote...</p>
          )}
        </CardContent>
      </Card>
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
