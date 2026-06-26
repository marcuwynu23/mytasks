import { Request, Response } from "express";
import { AuthRequest } from "@/middlewares/auth.middleware";
import { registerUser, loginUser, getProfile, updateProfile, changePassword, signToken, getTokenCookieOptions, COOKIE } from "@/services/app/auth/auth.services";

export async function register(req: Request, res: Response): Promise<void> {
  const { firstName, middleName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ message: "firstName, lastName, email and password are required" });
    return;
  }
  const passwordErrors: string[] = [];
  if (password.length < 8) passwordErrors.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) passwordErrors.push("an uppercase letter");
  if (!/[a-z]/.test(password)) passwordErrors.push("a lowercase letter");
  if (!/[0-9]/.test(password)) passwordErrors.push("a number");
  if (!/[^A-Za-z0-9]/.test(password)) passwordErrors.push("a symbol");
  if (passwordErrors.length) {
    res.status(400).json({ message: `Password must contain ${passwordErrors.join(", ")}` });
    return;
  }
  const user = await registerUser(firstName, middleName, lastName, email, password);
  if (!user) { res.status(409).json({ message: "Email already in use" }); return; }
  res.cookie(COOKIE, signToken(String(user._id)), getTokenCookieOptions());
  res.status(201).json({ message: "Registered successfully" });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ message: "Email and password are required" }); return; }
  const user = await loginUser(email, password);
  if (!user) { res.status(401).json({ message: "Invalid credentials" }); return; }
  res.cookie(COOKIE, signToken(String(user._id)), getTokenCookieOptions());
  res.json({ message: "Logged in successfully" });
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie(COOKIE, { httpOnly: true, sameSite: "lax" });
  res.json({ message: "Logged out successfully" });
}

export async function profile(req: AuthRequest, res: Response): Promise<void> {
  const user = await getProfile(req.userId!);
  if (!user) { res.status(404).json({ message: "User not found" }); return; }
  res.json(user);
}

export async function updateProfileHandler(req: AuthRequest, res: Response): Promise<void> {
  const { firstName, middleName, lastName } = req.body;
  if (!firstName && !middleName && !lastName) {
    res.status(400).json({ message: "At least one field is required" });
    return;
  }
  const user = await updateProfile(req.userId!, { firstName, middleName, lastName });
  if (!user) { res.status(404).json({ message: "User not found" }); return; }
  res.json(user);
}

export async function changePasswordHandler(req: AuthRequest, res: Response): Promise<void> {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: "currentPassword and newPassword are required" });
    return;
  }
  const passwordErrors: string[] = [];
  if (newPassword.length < 8) passwordErrors.push("at least 8 characters");
  if (!/[A-Z]/.test(newPassword)) passwordErrors.push("an uppercase letter");
  if (!/[a-z]/.test(newPassword)) passwordErrors.push("a lowercase letter");
  if (!/[0-9]/.test(newPassword)) passwordErrors.push("a number");
  if (!/[^A-Za-z0-9]/.test(newPassword)) passwordErrors.push("a symbol");
  if (passwordErrors.length) {
    res.status(400).json({ message: `Password must contain ${passwordErrors.join(", ")}` });
    return;
  }
  const result = await changePassword(req.userId!, currentPassword, newPassword);
  if (result === "not_found") { res.status(404).json({ message: "User not found" }); return; }
  if (result === "wrong_password") { res.status(401).json({ message: "Current password is incorrect" }); return; }
  res.json({ message: "Password changed successfully" });
}
