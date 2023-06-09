import { NextResponse } from "next/server";

export default function middleware(req, res) {
  //

  const token = req.cookies.get("token")?.value || req.headers.cookies?.token;

  if (req.url.includes("/api")) return NextResponse.next();

  // when user try to access secure root
  if (req.url.includes("/user") || req.url.includes("/profile")) {
    //

    if (token === null || token === undefined || token === "") {
      // User's browser doesn't have any token
      // they will redirect to home page
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_MAINURL}/logIn`);
    }

    //
  }

  if (req.url.includes("/logIn") || req.url.includes("/signIn")) {
    //

    if (token != null && token != undefined && token != "") {
      // User's browser doesn't have any token
      // they will redirect to home page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_MAINURL}/user/chats`
      );
    }

    //
  }

  return NextResponse.next();
}
