import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock react-router-dom navigation
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

// Mock axios instance
vi.mock("@/axios/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: { response: { use: vi.fn() } },
  },
}));

// Suppress console.error noise in tests
vi.spyOn(console, "error").mockImplementation(() => {});
