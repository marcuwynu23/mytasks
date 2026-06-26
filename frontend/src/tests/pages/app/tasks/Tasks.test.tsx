import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaskList, type Task } from "@/pages/app/tasks/TaskList";
import { TaskFormDialog } from "@/pages/app/tasks/TaskFormDialog";
import { TaskDeleteDialog } from "@/pages/app/tasks/TaskDeleteDialog";

const task: Task = { _id: "1", title: "Test Task", description: "desc", status: "pending" };
const noop = vi.fn();

describe("TaskList", () => {
  const baseProps = { tasks: [], filtered: [], paginated: [], page: 1, totalPages: 1, onPageChange: noop, onToggle: noop, onEdit: noop, onDelete: noop };

  it("shows empty state when no tasks", () => {
    render(<TaskList {...baseProps} />);
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it("shows no matching state when filtered empty but tasks exist", () => {
    render(<TaskList {...baseProps} tasks={[task]} filtered={[]} />);
    expect(screen.getByText(/no matching tasks/i)).toBeInTheDocument();
  });

  it("renders task title and badge", () => {
    render(<TaskList {...baseProps} tasks={[task]} filtered={[task]} paginated={[task]} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("calls onEdit when Edit clicked", () => {
    const onEdit = vi.fn();
    render(<TaskList {...baseProps} tasks={[task]} filtered={[task]} paginated={[task]} onEdit={onEdit} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(task);
  });

  it("calls onDelete when Delete clicked", () => {
    const onDelete = vi.fn();
    render(<TaskList {...baseProps} tasks={[task]} filtered={[task]} paginated={[task]} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(task);
  });

  it("calls onToggle when checkbox clicked", () => {
    const onToggle = vi.fn();
    render(<TaskList {...baseProps} tasks={[task]} filtered={[task]} paginated={[task]} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith(task);
  });

  it("shows pagination when totalPages > 1", () => {
    render(<TaskList {...baseProps} tasks={[task]} filtered={[task]} paginated={[task]} totalPages={3} />);
    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
  });
});

describe("TaskFormDialog", () => {
  const form = { title: "", description: "" };

  it("renders New Task title when not editing", () => {
    render(<TaskFormDialog open editing={false} form={form} onChange={noop} onSave={noop} onOpenChange={noop} />);
    expect(screen.getByText("New Task")).toBeInTheDocument();
  });

  it("renders Edit Task title when editing", () => {
    render(<TaskFormDialog open editing form={form} onChange={noop} onSave={noop} onOpenChange={noop} />);
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
  });

  it("Create button disabled when title empty", () => {
    render(<TaskFormDialog open editing={false} form={form} onChange={noop} onSave={noop} onOpenChange={noop} />);
    expect(screen.getByRole("button", { name: /create/i })).toBeDisabled();
  });

  it("Create button enabled when title filled", () => {
    render(<TaskFormDialog open editing={false} form={{ title: "hello", description: "" }} onChange={noop} onSave={noop} onOpenChange={noop} />);
    expect(screen.getByRole("button", { name: /create/i })).toBeEnabled();
  });
});

describe("TaskDeleteDialog", () => {
  it("renders task title in dialog", () => {
    render(<TaskDeleteDialog target={{ title: "My Task" }} onOpenChange={noop} onConfirm={noop} />);
    expect(screen.getByText(/"My Task"/)).toBeInTheDocument();
  });

  it("calls onConfirm when Delete clicked", () => {
    const onConfirm = vi.fn();
    render(<TaskDeleteDialog target={{ title: "My Task" }} onOpenChange={noop} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("does not render when target is null", () => {
    render(<TaskDeleteDialog target={null} onOpenChange={noop} onConfirm={noop} />);
    expect(screen.queryByText(/delete task/i)).not.toBeInTheDocument();
  });
});
