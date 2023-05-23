import { NextResponse } from "next/server";

export default function middleware(req, res) {
  //

  const token = req.cookies.get("token")?.value || req.headers.cookies?.token;

  // when user try to access secure root
  if (req.url.includes("/user") || req.url.includes("/profile")) {
    //

    if (token === null || token === undefined || token === "") {
      // User's browser doesn't have any token
      // they will redirect to home page
      return NextResponse.redirect("https://chat-app-2-0.vercel.app/logIn");
    }

    //
  } //

  return NextResponse.next();
}
