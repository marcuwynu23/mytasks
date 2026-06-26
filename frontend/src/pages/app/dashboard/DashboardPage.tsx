import api from "@/axios/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";

type Stats = { total: number; completed: number; pending: number };
type Quote = { content: string; author: string };

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, pending: 0 });
  const [quote, setQuote] = useState<Quote | null>(null);
  const [now, setNow] = useState(new Date());

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

    const ticker = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(ticker);
  }, []);

  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-wide text-[#26524e]">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your tasks.</p>
        </div>
      </div>

      <div className="flex items-stretch gap-5">
        <Card className="shadow-none rounded-2xl flex-1">
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

        <Card className="shadow-none rounded-2xl flex items-center justify-center px-8">
          <div className="text-center">
            <p className="text-4xl text-[#26524e] font-bold font-mono tracking-tight">{time}</p>
            <p className="text-sm text-muted-foreground mt-1">{date}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Total Tasks" value={stats.total} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Pending" value={stats.pending} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="shadow-none rounded-2xl bg-primary border-accent">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-primary-foreground text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-primary-foreground text-center">{value}</p>
      </CardContent>
    </Card>
  );
}
