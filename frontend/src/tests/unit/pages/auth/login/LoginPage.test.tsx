import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "@/pages/auth/login/LoginPage";
import api from "@/axios/axios";

const renderLogin = () => render(<MemoryRouter><LoginPage /></MemoryRouter>);

describe("LoginPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders email and password fields", () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders sign in button", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows error on failed login", async () => {
    vi.mocked(api.post).mockRejectedValueOnce({ response: { data: { message: "Invalid credentials" } } });
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@a.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => expect(screen.getByText("Invalid credentials")).toBeInTheDocument());
  });

  it("shows network error message", async () => {
    vi.mocked(api.post).mockRejectedValueOnce({ message: "Network error. Please check your connection." });
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@a.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "pass" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => expect(screen.getByText(/network error/i)).toBeInTheDocument());
  });

  it("has link to register page", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });
});
