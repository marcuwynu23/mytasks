import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../../models/user.model";
import config from "../../../config/config";
import { AuthRequest } from "../../../middlewares/auth.middleware";

const COOKIE_NAME = "token";

function parseDurationMs(duration: string): number {
  const unit = duration.slice(-1);
  const value = parseInt(duration, 10);
  const map: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * (map[unit] ?? 86400000);
}

function setTokenCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: parseDurationMs(config.jwt.expiresIn),
  });
}

function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  });
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }
  if (await User.findOne({ email })) {
    res.status(409).json({ message: "Email already in use" });
    return;
  }
  const user = await User.create({ name: name ?? "", email, password: await bcrypt.hash(password, 10) });
  setTokenCookie(res, signToken(String(user._id)));
  res.status(201).json({ message: "Registered successfully" });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }
  setTokenCookie(res, signToken(String(user._id)));
  res.json({ message: "Logged in successfully" });
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "lax" });
  res.json({ message: "Logged out successfully" });
}

export async function profile(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findById(req.userId).select("-password");
  if (!user) { res.status(404).json({ message: "User not found" }); return; }
  res.json(user);
}
