import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptEdge } from "@/lib/session-edge";

const protectedRoutes = ["/account"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some((r) => path.startsWith(r));

  if (isProtected) {
    const cookie = request.cookies.get("session")?.value;
    const session = await decryptEdge(cookie);

    if (!session?.userId) {
      return NextResponse.redirect(new URL("/auth/signin", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
