import dbConnect from "@/Database/dbCoonect";
import UserData from "@/Models/usersData_model";
import UserNotify from "@/Models/userNotify_model";

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

    const selfUser = await UserData.findOne({ userId: tokenData._id });
    const allUsers = await UserData.find({});

    const data = [];

    allUsers.map((item) => {
      let friendStatus = 0;
      let invitation = "none";

      if (selfUser.friendsId.includes(item.userId)) friendStatus = 1;
      if (selfUser.reqSendId.includes(item.userId)) invitation = "Send";
      if (selfUser.reqRecievedId.includes(item.userId)) invitation = "Recieved";

      return data.push({
        name: item.name,
        username: item.username,
        userId: item.userId,
        friend: friendStatus,
        invitation: invitation,
      });
    });

    return NextResponse.json({
      status: true,
      msg: "Successfully send all Users",
      data: data,
    });

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
// POST Request : Start here
// *****************************
export async function POST(req, res) {
  // Database is Connecting.
  dbConnect();
  console.log("Database is Connected");

  try {
    //

    const body = await req.json();
    const token = req.cookies.get("token")?.value || req.headers.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWTSECRET);

    const selfUser = await UserData.findOne({ userId: tokenData._id });

    const searchItem = body.search;
    const allUsers = await UserData.find(
      {
        $or: [
          {
            name: { $regex: `${searchItem}`, $options: "i" },
          },
          {
            username: { $regex: `${searchItem}`, $options: "i" },
          },
        ],
      },
      {
        _id: 0,
        userId: 1,
        name: 1,
        username: 1,
        avtar: 1,
      }
    );

    const data = [];

    allUsers.map((item) => {
      let friendStatus = 0;
      if (selfUser.friendsId.includes(item.userId)) friendStatus = 1;

      return data.push({
        name: item.name,
        username: item.username,
        userId: item.userId,
        friend: friendStatus,
      });
    });

    return NextResponse.json({
      status: true,
      msg: "Successfully send particular Users",
      users: data,
    });

    //
  } catch (err) {
    console.log(err);
  }
  //

  // End of the Route
}
// *****************************
// POST Request : End here
// *****************************

// *****************************
// PUT Request : Start here
// *****************************
export async function PUT(req, res) {
  // Database is Connecting.
  dbConnect();
  console.log("Database is Connected");

  try {
    //

    const body = await req.json();
    const token = req.cookies.get("token")?.value || req.headers.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWTSECRET);

    const selfUser = await UserData.findOne({ userId: tokenData._id });
    const targetUser = await UserData.findOne({ userId: body.targetUserId });

    selfUser.notifications.count += 1;
    targetUser.notifications.count += 1;

    const selfNotify = await UserNotify.findOneAndUpdate(
      {
        _id: selfUser.notifications.notifyId,
      },
      {
        $push: {
          [`invitation.send`]: { userId: body.targetUserId },
        },
      }
    );

    const targetNotify = await UserNotify.findOneAndUpdate(
      {
        _id: targetUser.notifications.notifyId,
      },
      {
        $push: {
          [`invitation.recieved`]: { userId: tokenData._id },
        },
      }
    );

    selfUser.reqSendId.push(targetUser.userId);
    targetUser.reqRecievedId.push(selfUser.userId);

    selfUser.save();
    targetUser.save();

    return NextResponse.json({
      status: true,
      msg: "Successfully send the requeset message",
    });

    //
  } catch (err) {
    console.log(err);
  }

  // End of the Route
}
// *****************************
// PUT Request : End here
// *****************************
