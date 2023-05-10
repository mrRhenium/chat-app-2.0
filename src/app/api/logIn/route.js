import dbConnect from "@/Database/dbCoonect";
import User from "@/Models/users_model";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req, res) {
  // console.log("Database Connecting");
  dbConnect();
  console.log("Database Connected");

  const body = await req.json();

  const user = await User.findOne({ username: body.username });
  let valid_password = user
    ? await bcrypt.compare(body.password, user.password)
    : false;

  if (!user || !valid_password) {
    return NextResponse.json({
      status: false,
      msg: "Bad Credentials!",
    });
  }

  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWTSECRET,
    {
      expiresIn: "1d",
    }
  );

  return NextResponse.json({
    status: true,
    msg: "Successfully LogIn",
    token: token,
  });
}
