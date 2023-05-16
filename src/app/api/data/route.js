import dbConnect from "@/Database/dbCoonect";

import UserData from "@/Models/usersData_model";
// import User from "@/Models/users_model";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req, res) {
  //

  // Database is Connecting.
  dbConnect();
  console.log("Database is Connected");

  const token = req.cookies.get("token")?.value || req.headers.cookies.token;

  console.log("token: ", token);

  try {
    const tokenData = jwt.verify(token, process.env.JWTSECRET);
    const user = await UserData.findOne({ userId: tokenData._id });

    // When User not found in DB
    if (!user) {
      //

      return NextResponse.json({
        status: false,
        msg: "User not found!",
      });

      //
    } else {
      //

      return NextResponse.json({
        status: true,
        msg: "User is Successfully Found",
        user: user,
      });

      //
    }

    //
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      status: false,
      msg: "User not found!",
    });
  }

  // End of the Route
}
