import { prisma } from "./prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// In a real app, decode a JWT or session. Here, just check for 'auth' cookie and return user 1.
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    return user;
  } catch {
    return null;
  }
}
