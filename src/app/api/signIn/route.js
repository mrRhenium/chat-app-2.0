import dbConnect from "@/Database/dbCoonect";
import User from "@/Models/users_model";
import UserData from "@/Models/usersData_model";
import UserNotify from "@/Models/userNotify_model";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// *****************************
// POST Request : Start here
// *****************************
export async function POST(req, res) {
  //

  // console.log("Database Connecting");
  dbConnect();
  console.log("Database Connected");

  try {
    //

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

      const notify = await UserNotify.create({
        invitation: {
          sent: [],
          recieved: [],
        },
      });

      const userData = await UserData.create({
        userId: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        notifications: { notifyId: notify._id, count: 0 },
      });

      const token = jwt.sign(
        { _id: user._id, username: user.username },
        process.env.JWTSECRET,
        {
          expiresIn: "1d",
        }
      );

      return NextResponse.json({
        status: true,
        msg: "Successfully SignIn",
        token: token,
      });
      //
    }

    //
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      status: false,
      msg: "ERROR: Something went wrong",
    });
  }

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

  const token = req.cookies.get("token")?.value || req.headers.cookies.token;
  const tokenData = jwt.verify(token, process.env.JWTSECRET);

  try {
    //

    const selfUser = await User.findOneAndUpdate(
      { _id: tokenData._id },
      {
        $set: { deleted: 1 },
      }
    );

    return NextResponse.json({
      status: true,
      msg: "Successfully! Deleted you Account.",
    });

    //
  } catch (err) {
    console.log(err);
  }
}
// *****************************
// PUT Request : End here
// *****************************
