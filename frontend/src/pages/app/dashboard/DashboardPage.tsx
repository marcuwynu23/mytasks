import api from "@/axios/axios";
import axios from "axios";
import { useEffect, useState } from "react";
import { ClockCard } from "./ClockCard";
import { QuoteCard } from "./QuoteCard";
import { StatsCards } from "./StatsCards";

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
    <div className="p-4 sm:p-8 space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your tasks.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-5">
        <QuoteCard quote={quote} />
        <ClockCard />
      </div>

      <StatsCards stats={stats} />
    </div>
  );
}
