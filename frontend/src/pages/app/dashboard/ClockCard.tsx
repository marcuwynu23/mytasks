import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

export function ClockCard() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const ticker = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(ticker);
  }, []);

  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <Card className="shadow-none rounded-2xl flex items-center justify-center px-8 py-6">
      <div className="text-center">
        <p className="text-4xl font-bold font-mono tracking-tight">{time}</p>
        <p className="text-sm text-muted-foreground mt-1">{date}</p>
      </div>
    </Card>
  );
}
