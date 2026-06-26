import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RegisterPage from "@/pages/auth/register/RegisterPage";
import api from "@/axios/axios";

const renderRegister = () => render(<MemoryRouter><RegisterPage /></MemoryRouter>);

describe("RegisterPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders all form fields", () => {
    renderRegister();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows password strength badges when typing password", () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "abc" } });
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it("shows ✓ for passed rule", () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "Password1!" } });
    const badges = screen.getAllByText(/✓/);
    expect(badges.length).toBe(5);
  });

  it("shows error on failed registration", async () => {
    vi.mocked(api.post).mockRejectedValueOnce({ response: { data: { message: "Email already in use" } } });
    vi.mocked(api.get).mockResolvedValueOnce({ data: {} });
    renderRegister();
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@a.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "Password1!" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await waitFor(() => expect(screen.getByText("Email already in use")).toBeInTheDocument());
  });

  it("has link to login page", () => {
    renderRegister();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });
});
