import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 text-8xl font-bold tracking-tight text-muted-foreground/30">404</div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight">Page not found</h1>

        <p className="mb-8 text-muted-foreground">The page you're looking for doesn't exist or may have been moved.</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-accent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
