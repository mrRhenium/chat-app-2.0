import dbConnect from "@/Database/dbCoonect";
import User from "@/Models/users_model";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// *****************************
// POST Request : Start here
// *****************************
export async function POST(req, res) {
  // console.log("Database Connecting");
  dbConnect();
  console.log("Database Connected");

  try {
    //

    const body = await req.json();
    const user = await User.findOne({ username: body.username });

    let valid_password = user
      ? await bcrypt.compare(body.password, user.password)
      : false;

    // if (!user) {
    //   return NextResponse.json({
    //     status: false,
    //     msg: "User not found, Please!! SignIn",
    //   });
    // }

    if (!user || !valid_password) {
      return NextResponse.json({
        status: false,
        msg: "Bad Credentials!",
      });
    }

    if (user.logInStatus) {
      return NextResponse.json({
        status: false,
        msg: "User is already loggedIn",
      });
    }

    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWTSECRET,
      {
        expiresIn: "1d",
      }
    );

    user.logInStatus = 1;
    await user.save();

    // console.log("token : ", token);

    return NextResponse.json({
      status: true,
      msg: "Successfully LogIn",
      token: token,
    });

    //
  } catch (err) {
    console.log(err);
  }
}
// *****************************
// POST Request : End here
// *****************************

// *****************************
// PUT Request : End here
// *****************************
export async function PUT(req, res) {
  // console.log("Database Connecting");
  dbConnect();
  console.log("Database Connected");

  try {
    //

    const token = req.cookies.get("token")?.value || req.headers.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWTSECRET);

    const selfUser = await User.findOneAndUpdate(
      { _id: tokenData._id },
      {
        $set: { logInStatus: false },
      }
    );

    // console.log(selfUser);

    return NextResponse.json({
      status: true,
      msg: "Successfully! : LogOut",
    });

    //
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      status: false,
      msg: "ERROR! : Something went wrong with logOut",
    });
  }
}
// *****************************
// PUT Request : End here
// *****************************
