import { NextResponse } from "next/server";

export async function GET(req, res) {
  // const data = await User.find({});
  return NextResponse.json({ name: "Niesh Yadav" });
}
