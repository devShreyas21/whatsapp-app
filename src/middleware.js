import { NextResponse } from "next/server";

export function middleware(req) {
  const auth = req.headers.get("authorization");

  if (!auth || auth !== `Bearer ${process.env.STATIC_BEARER_TOKEN}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
