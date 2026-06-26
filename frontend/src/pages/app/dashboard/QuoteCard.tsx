import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Quote = { content: string; author: string };

export function QuoteCard({ quote }: { quote: Quote | null }) {
  return (
    <Card className="shadow-none rounded-2xl border-0 ring-0 flex-1">
      <CardHeader className="pb-1 pt-5">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center">Quote of the Day</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 text-center">
        {quote ? (
          <>
            <p className="text-base italic leading-relaxed">&ldquo;{quote.content}&rdquo;</p>
            <p className="text-sm text-muted-foreground mt-3 font-medium">&mdash; {quote.author}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground animate-pulse">Loading quote...</p>
        )}
      </CardContent>
    </Card>
  );
}
