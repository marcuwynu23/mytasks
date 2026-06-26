import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DashboardPage from "@/pages/app/dashboard/DashboardPage";
import api from "@/axios/axios";
import axios from "axios";

vi.mock("axios", async () => {
  const actual = await vi.importActual("axios");
  return { ...actual, default: { get: vi.fn() } };
});

const mockTasks = [
  { _id: "1", title: "Task 1", status: "completed" },
  { _id: "2", title: "Task 2", status: "pending" },
  { _id: "3", title: "Task 3", status: "pending" },
];

function renderPage() {
  return render(<MemoryRouter><DashboardPage /></MemoryRouter>);
}

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.get).mockResolvedValue({ data: mockTasks });
    vi.mocked(axios.get).mockResolvedValue({
      data: [{ q: "Stay hungry, stay foolish.", a: "Steve Jobs" }],
    });
  });

  it("renders heading and description", () => {
    renderPage();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText(/overview of your tasks/i)).toBeInTheDocument();
  });

  it("loads tasks and displays stats", async () => {
    renderPage();
    expect(api.get).toHaveBeenCalledWith("/tasks");
    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows loading state for quote then displays it", async () => {
    renderPage();
    expect(screen.getByText(/loading quote/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Stay hungry, stay foolish/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Steve Jobs/)).toBeInTheDocument();
  });

  it("shows fallback quote on API failure", async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error("Network error"));
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/The secret of getting ahead/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Mark Twain/)).toBeInTheDocument();
  });

  it("renders clock with time", () => {
    renderPage();
    expect(screen.getByText(/AM|PM/i)).toBeInTheDocument();
  });
});
