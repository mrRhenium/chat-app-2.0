import dbConnect from "@/Database/dbCoonect";
import User from "@/Models/users_model";

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req, res) {
  // console.log("Database Connecting");
  dbConnect();
  console.log("Database Connected");

  const body = await req.json();

  const exist_user = await User.findOne({
    $or: [{ username: body.username }, { email: body.email }],
  });

  if (exist_user) {
    //
    if (exist_user.username === body.username) {
      return NextResponse.json({
        status: false,
        msg: "This username already Exist!",
      });
    } else if (exist_user.email === body.email) {
      return NextResponse.json({
        status: false,
        msg: "This Email-Id already Exist!",
      });
    }

    //
  } else {
    //

    const newUser = body;
    const hash_password = await bcrypt.hash(body.password, 10);

    const user = await User.create({ ...newUser, password: hash_password });

    return NextResponse.json({
      status: true,
      msg: "Successfully SignIn",
    });
    //
  }
}
