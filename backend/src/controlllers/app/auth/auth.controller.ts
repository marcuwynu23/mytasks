import { Request, Response } from "express";
import { AuthRequest } from "@/middlewares/auth.middleware";
import { registerUser, loginUser, getProfile, signToken, getTokenCookieOptions, COOKIE } from "@/services/app/auth/auth.services";

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;
  if (!email || !password) { res.status(400).json({ message: "Email and password are required" }); return; }
  const user = await registerUser(name, email, password);
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
