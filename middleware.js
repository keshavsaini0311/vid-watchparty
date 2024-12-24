import { NextResponse, NextRequest } from "next/server";

export default function middleware(request) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === "/auth";
    const token = request.cookies.get("token")?.value || "";
    
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/auth", request.nextUrl));
    }
}

export const config = {
    matcher: [
        "/",
        "/auth",
        "/room",
        "/room/:id*",
    ]
}