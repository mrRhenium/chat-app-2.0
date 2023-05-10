import dbConnect from "@/Database/dbCoonect";
import User from "@/Models/users_model";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  // Database is Connecting.
  dbConnect();
  // console.log("Database is Connected");

  const body = await req.json();
  const user = await User.findOne({ username: body.username });

  if (user) {
    return NextResponse.json({ msg: "This user is exist!" });
  }

  return NextResponse.json({ msg: "This user is not exist!" });
}
