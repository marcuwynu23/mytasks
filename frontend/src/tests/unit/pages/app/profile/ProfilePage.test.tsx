import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfilePage from "@/pages/app/profile/ProfilePage";
import api from "@/axios/axios";

vi.mock("@/auth/useAuth", () => ({
  useAuth: () => ({
    user: { firstName: "John", middleName: "M", lastName: "Doe", email: "john@example.com" },
    setUser: vi.fn(),
  }),
}));

function renderPage() {
  return render(<MemoryRouter><ProfilePage /></MemoryRouter>);
}

const mockUser = { firstName: "Jane", middleName: "M", lastName: "Doe", email: "jane@example.com" };

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders heading and description", () => {
    renderPage();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText(/manage your personal information/i)).toBeInTheDocument();
  });

  it("displays user name and email", () => {
    renderPage();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    const emails = screen.getAllByText("john@example.com");
    expect(emails.length).toBe(2);
  });

  it("displays initials avatar", () => {
    renderPage();
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders user detail fields", () => {
    renderPage();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("opens and submits edit profile dialog", async () => {
    vi.mocked(api.put).mockResolvedValue({ data: mockUser });
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /edit profile/i })).toBeInTheDocument());
    const firstNameInput = screen.getByDisplayValue("John");
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/auth/profile", {
        firstName: "Jane",
        middleName: "M",
        lastName: "Doe",
      });
    });
  });

  it("shows error on edit profile failure", async () => {
    vi.mocked(api.put).mockRejectedValue({
      response: { data: { message: "Email already taken" } },
    });
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /edit profile/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
    await waitFor(() => {
      expect(screen.getByText("Email already taken")).toBeInTheDocument();
    });
  });

  it("opens change password dialog and submits", async () => {
    vi.mocked(api.put).mockResolvedValue({});
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /change password/i })).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: "OldPass1!" },
    });
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: "NewPass1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/auth/password", {
        currentPassword: "OldPass1!",
        newPassword: "NewPass1!",
      });
    });
  });

  it("shows error on change password failure", async () => {
    vi.mocked(api.put).mockRejectedValue({
      response: { data: { message: "Current password is incorrect" } },
    });
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /change password/i })).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: "wrong" },
    });
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: "NewPass1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    await waitFor(() => {
      expect(screen.getByText("Current password is incorrect")).toBeInTheDocument();
    });
  });

  it("shows password strength badges when typing new password", async () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /change password/i })).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: "abc" },
    });
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
  });
});
