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
    const body = await req.json();

    if (body.action === "User is online") {
      //

      await UserData.findOneAndUpdate(
        { userId: tokenData._id },
        {
          $set: { onlineStatus: true },
        }
      );

      return NextResponse.json({
        status: true,
        msg: "Successfully! : User is Online",
      });

      //
    } //
    else if (body.action === "User is offline") {
      //

      await UserData.findOneAndUpdate(
        { userId: tokenData._id },
        {
          $set: { onlineStatus: false },
        }
      );

      return NextResponse.json({
        status: true,
        msg: "Successfully! : User is Offline",
      });

      //
    } //
    else if (body.action === "Update Avtar") {
      await UserData.findOneAndUpdate(
        {
          userId: tokenData._id,
        },
        {
          $set: {
            avtar: body.imgUrl,
          },
        }
      );

      return NextResponse.json({
        status: true,
        msg: "Successfully! : Avtar is Updated.",
      });
    } //
    else if (body.action == "Delete Avtar") {
      await UserData.findOneAndUpdate(
        {
          userId: tokenData._id,
        },
        {
          $set: {
            avtar: `/assets/${tokenData._id}`,
          },
        }
      );

      return NextResponse.json({
        status: true,
        msg: "Successfully! : Avtar is Deleted.",
      });
    }

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
