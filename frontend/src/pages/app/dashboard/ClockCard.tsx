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
    <Card className="shadow-none rounded-2xl border-0 ring-0 flex items-center justify-center px-8 py-8">
      <div className="text-center">
        <p className="text-4xl font-extrabold font-mono tracking-tight text-primary">{time}</p>
        <p className="text-sm text-muted-foreground mt-2 tracking-wide">{date}</p>
      </div>
    </Card>
  );
}
