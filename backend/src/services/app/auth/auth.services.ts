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

export async function registerUser(firstName: string, middleName: string | undefined, lastName: string, email: string, password: string) {
  if (await User.findOne({ email })) return null;
  return User.create({ firstName, middleName: middleName ?? "", lastName, email, password: await bcrypt.hash(password, 10) });
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) return null;
  return user;
}

export async function getProfile(userId: string) {
  return User.findById(userId).select("-password");
}

export async function updateProfile(userId: string, data: { firstName?: string; middleName?: string; lastName?: string }) {
  return User.findByIdAndUpdate(userId, { $set: data }, { new: true, runValidators: true }).select("-password");
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<"not_found" | "wrong_password" | "ok"> {
  const user = await User.findById(userId);
  if (!user) return "not_found";
  if (!(await bcrypt.compare(currentPassword, user.password))) return "wrong_password";
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return "ok";
}
