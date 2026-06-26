import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { QuoteCard } from "@/pages/app/dashboard/QuoteCard";
import { ClockCard } from "@/pages/app/dashboard/ClockCard";
import { StatsCards } from "@/pages/app/dashboard/StatsCards";

describe("QuoteCard", () => {
  it("shows loading state when quote is null", () => {
    render(<QuoteCard quote={null} />);
    expect(screen.getByText(/loading quote/i)).toBeInTheDocument();
  });

  it("renders quote content and author", () => {
    render(<QuoteCard quote={{ content: "Just do it.", author: "Nike" }} />);
    expect(screen.getByText(/"Just do it."/)).toBeInTheDocument();
    expect(screen.getByText(/Nike/)).toBeInTheDocument();
  });
});

describe("ClockCard", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("renders time and date", () => {
    render(<ClockCard />);
    // AM/PM time format
    expect(screen.getByText(/AM|PM/i)).toBeInTheDocument();
  });
});

describe("StatsCards", () => {
  it("renders all three stat values", () => {
    render(<StatsCards stats={{ total: 10, completed: 6, pending: 4 }} />);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("renders stat labels", () => {
    render(<StatsCards stats={{ total: 0, completed: 0, pending: 0 }} />);
    expect(screen.getByText(/total tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });
});
