import dbConnect from "@/Database/dbCoonect";
import UserData from "@/Models/usersData_model";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
//
//

// *****************************
// GET Request : Start here
// *****************************
export async function GET(req, context) {
  // Database is Connecting.
  dbConnect();
  console.log("Database is Connected");

  const token = req.cookies.get("token")?.value || req.headers.cookies.token;
  const tokenData = jwt.verify(token, process.env.JWTSECRET);
  const pUsername = context.params.username;

  try {
    //

    const user = await UserData.findOne(
      { username: pUsername },
      {
        userId: 1,
        name: 1,
        username: 1,
        avtar: 1,
        about: 1,
        email: 1,
        follower: 1,
        following: 1,
        onlineStatus: 1,
        blockUserId: 1,
      }
    );

    const selfUser = await UserData.findOne(
      { userId: tokenData._id },
      {
        userId: 1,
        username: 1,
        friendsId: 1,
      }
    );

    if (!user) {
      //

      return NextResponse.json({
        status: false,
        msg: "Successfully user not found",
      });

      //
    } else if (user.username === selfUser.username) {
      //

      return NextResponse.json({
        status: true,
        msg: "Successfully send author profile",
        data: user,
      });

      //
    } else if (selfUser.friendsId.includes(user.userId)) {
      //

      if (selfUser.blockUserId.includes(user.userId)) {
        return NextResponse.json({
          status: false,
          msg: "Successfully You blocked this account",
          data: user,
        });
      }

      if (user.blockUserId.includes(selfUser.userId)) {
        return NextResponse.json({
          status: false,
          msg: "Successfully this user blocked your account",
          data: user,
        });
      }

      return NextResponse.json({
        status: true,
        msg: "Successfully send friend profile",
        data: user,
      });

      //
    } else {
      //

      return NextResponse.json({
        status: true,
        msg: "Successfully send unknown user profile",
        data: user,
      });

      //
    }

    //
  } catch (err) {
    console.log(err);
  }
  //

  // End of the Route
}
// *****************************
// GET Request : End here
// *****************************

// *****************************
// PUT Request : Start here
// *****************************
export async function PUT(req, context) {
  // Database is Connecting.
  dbConnect();
  console.log("Database is Connected");

  const token = req.cookies.get("token")?.value || req.headers.cookies.token;
  const tokenData = jwt.verify(token, process.env.JWTSECRET);
  const pUsername = context.params.username;

  try {
    //

    const body = await body.json();

    if (body.action === "Block user") {
      //

      const user = await UserData.findOne(
        { username: pUsername },
        {
          userId: 1,
        }
      );

      const selfUser = await UserData.findOneAndUpdate(
        { _id: tokenData._id },
        {
          $push: {
            blockUserId: user.userId,
          },
        }
      );

      return NextResponse.json({
        status: true,
        msg: "Successfully block the user",
      });

      //
    } else if (body.action === "Unblock user") {
      //

      const user = await UserData.findOne(
        { username: pUsername },
        {
          userId: 1,
        }
      );

      const selfUser = await UserData.findOneAndUpdate(
        { _id: tokenData._id },
        {
          $pull: {
            blockUserId: user.userId,
          },
        }
      );

      return NextResponse.json({
        status: true,
        msg: "Successfully unblock the user",
      });

      //
    }

    //
  } catch (err) {
    console.log(err);
  }
  //

  // End of the Route
}
// *****************************
// PUT Request : End here
// *****************************
