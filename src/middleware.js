import { NextResponse } from "next/server";

export default async function middleware(req, res) {
  if (req.url.includes("/user")) {
    const token = req.cookies.get("token")?.value;

    if (token != null) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect("https://chat-web-app-ruby.vercel.app/");
    }
  }

  return NextResponse.next();
}
