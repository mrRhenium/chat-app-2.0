import dbConnect from "@/Database/dbCoonect";
import UserData from "@/Models/usersData_model";
import User from "@/Models/users_model";
import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
//
//

// *****************************
// GET Request : Start here
// *****************************
export async function GET(req, res) {
  // Database is Connecting.
  dbConnect();
  console.log("Database is Connected");

  try {
    //

    const token = req.cookies.get("token")?.value || req.headers.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWTSECRET);

    const user = await UserData.findOne(
      { userId: tokenData._id },
      {
        notifications: 1,
      }
    );

    if (!user) {
      return NextResponse.json({
        status: false,
        msg: `User not Found.`,
      });
    }

    return NextResponse.json({
      status: true,
      msg: "Use is Found.",
      user: user,
    });

    //
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      status: false,
      msg: `ERROR : Something went wrong.`,
    });
  }

  // End of the Route
}
// *****************************
// GET Request : End here
// *****************************

// *****************************
// POST Request : Start here
// *****************************
export async function POST(req, res) {
  // Database is Connecting.
  dbConnect();
  console.log("Database is Connected");

  const body = await req.json();
  const user = await User.findOne({ username: body.username });

  if (user) {
    return NextResponse.json({ msg: "This user is exist!" });
  }

  return NextResponse.json({ msg: "This user is not exist!" });

  // End of the Route
}
// *****************************
// POST Request : End here
// *****************************
