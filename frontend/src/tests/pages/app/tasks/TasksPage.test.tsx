import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TasksPage from "@/pages/app/tasks/TasksPage";
import api from "@/axios/axios";

const mockTasks = [
  { _id: "1", title: "Task Alpha", description: "First task", status: "pending" },
  { _id: "2", title: "Task Beta", description: "Second task", status: "completed" },
  { _id: "3", title: "Task Gamma", description: "Third task", status: "pending" },
];

function renderPage() {
  return render(<MemoryRouter><TasksPage /></MemoryRouter>);
}

describe("TasksPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.get).mockResolvedValue({ data: mockTasks });
  });

  it("renders heading and description", () => {
    renderPage();
    expect(screen.getByText("Tasks")).toBeInTheDocument();
    expect(screen.getByText(/manage and track your tasks/i)).toBeInTheDocument();
  });

  it("renders New Task button", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /new task/i })).toBeInTheDocument();
  });

  it("loads tasks on mount", async () => {
    renderPage();
    expect(api.get).toHaveBeenCalledWith("/tasks");
    await waitFor(() => {
      expect(screen.getByText("Task Alpha")).toBeInTheDocument();
    });
    expect(screen.getByText("Task Beta")).toBeInTheDocument();
    expect(screen.getByText("Task Gamma")).toBeInTheDocument();
  });

  it("filters tasks by search query", async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText("Task Alpha")).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/search tasks/i), { target: { value: "Beta" } });
    await waitFor(() => {
      expect(screen.queryByText("Task Alpha")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Task Beta")).toBeInTheDocument();
  });

  it("shows empty state when no tasks", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });
  });

  it("opens create dialog on New Task click", async () => {
    renderPage();
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: /new task/i }));
    expect(screen.getByRole("heading", { name: /new task/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
  });

  it("opens edit dialog when Edit clicked", async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText("Task Alpha")).toBeInTheDocument());
    fireEvent.click(screen.getAllByRole("button", { name: /edit/i })[0]);
    expect(screen.getByRole("heading", { name: /edit task/i })).toBeInTheDocument();
  });

  it("creates a new task via dialog", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} });
    renderPage();
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: /new task/i }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /new task/i })).toBeInTheDocument());
    fireEvent.change(screen.getByRole("textbox", { name: /title/i }), { target: { value: "My New Task" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/tasks", { title: "My New Task", description: "" });
    });
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it("deletes a task on confirm", async () => {
    vi.mocked(api.delete).mockResolvedValue({});
    renderPage();
    await waitFor(() => expect(screen.getByText("Task Alpha")).toBeInTheDocument());
    fireEvent.click(screen.getAllByRole("button", { name: /delete/i })[0]);
    await waitFor(() => expect(screen.getByText(/delete task/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith("/tasks/1");
    });
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it("toggles task status on checkbox click", async () => {
    vi.mocked(api.put).mockResolvedValue({});
    renderPage();
    await waitFor(() => expect(screen.getByText("Task Alpha")).toBeInTheDocument());
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/tasks/1", { status: "completed" });
    });
  });
});
