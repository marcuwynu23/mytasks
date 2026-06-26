import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Quote = { content: string; author: string };

export function QuoteCard({ quote }: { quote: Quote | null }) {
  return (
    <Card className="shadow-none rounded-2xl flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quote of the Day</CardTitle>
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
  );
}
