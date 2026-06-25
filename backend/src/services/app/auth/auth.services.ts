import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/models/user.model";
import config from "@/config/config";

const COOKIE_NAME = "token";

export function parseDurationMs(duration: string): number {
  const unit = duration.slice(-1);
  const value = parseInt(duration, 10);
  const map: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * (map[unit] ?? 86400000);
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function getTokenCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: parseDurationMs(config.jwt.expiresIn),
  };
}

export const COOKIE = COOKIE_NAME;

export async function registerUser(name: string, email: string, password: string) {
  if (await User.findOne({ email })) return null;
  return User.create({ name: name ?? "", email, password: await bcrypt.hash(password, 10) });
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) return null;
  return user;
}

export async function getProfile(userId: string) {
  return User.findById(userId).select("-password");
}
