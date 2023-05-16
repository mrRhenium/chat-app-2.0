import dbConnect from "@/Database/dbCoonect";
import Chat from "@/Models/userChat_model";
import UserNotify from "@/Models/userNotify_model";
import UserData from "@/Models/usersData_model";

import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
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

    const user = await UserData.findOne({ userId: tokenData._id });
    const notify = await UserNotify.findById({
      _id: user.notifications.notifyId,
    });

    const data = notify.invitation;
    // console.log(user);

    //
    return NextResponse.json({
      status: true,
      msg: "Successfully send!",
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

    if (body.action === "Recieved-Invitation Accepted") {
      const selfUser = await UserData.findOne({ userId: tokenData._id });
      const friendUser = await UserData.findOne({ userId: body.targetUserId });

      const selfNotify = await UserNotify.findByIdAndUpdate(
        {
          _id: selfUser.notifications.notifyId,
          [`invitation.recieved.active`]: true,
        },
        { $pull: { [`invitation.recieved`]: { userId: friendUser.userId } } }
      );

      const friendNotify = await UserNotify.findByIdAndUpdate(
        {
          _id: friendUser.notifications.notifyId,
          [`invitation.send.active`]: true,
        },
        { $pull: { [`invitation.send`]: { userId: selfUser.userId } } }
      );

      const userChat = await Chat.create({
        message: [],
      });

      const friend = {
        userId: friendUser.userId,
        username: friendUser.username,
        chatId: userChat._id,
        username: friendUser.username,
        invited: 0,
      };

      const self = {
        userId: selfUser.userId,
        username: selfUser.username,
        chatId: userChat._id,
        username: selfUser.username,
        invited: 1,
      };

      selfUser.follower += 1;
      selfUser.notifications.count -= 1;
      selfUser.friends.push(friend);
      selfUser.friendsId.push(friendUser.userId);

      friendUser.following += 1;
      friendUser.notifications.count -= 1;
      friendUser.friends.push(self);
      friendUser.friendsId.push(selfUser.userId);

      let index;

      index = selfUser.reqRecievedId.indexOf(friendUser.userId);
      selfUser.reqRecievedId.splice(index, 1);

      index = friendUser.reqSendId.indexOf(selfUser.userId);
      friendUser.reqSendId.splice(index, 1);

      // const s = await selfNotify.

      await selfUser.save();
      await friendUser.save();

      return NextResponse.json({
        status: true,
        msg: "Successfully Accepted the invitation",
      });

      //
    } // //
    else if (body.action === "Recieved-Invitation Rejected") {
      //

      const selfUser = await UserData.findOne({ userId: tokenData._id });
      const friendUser = await UserData.findOne({ userId: body.targetUserId });

      const selfNotify = await UserNotify.findByIdAndUpdate(
        {
          _id: selfUser.notifications.notifyId,
        },
        { $pull: { [`invitation.recieved`]: { userId: friendUser.userId } } }
      );

      const friendNotify = await UserNotify.findOneAndUpdate(
        {
          _id: friendUser.notifications.notifyId,
          [`invitation.send.userId`]: selfUser.userId,
          [`invitation.send.active`]: true,
        },
        { $set: { [`invitation.send.$.active`]: 0 } }
      );

      selfUser.notifications.count -= 1;

      let index;

      index = selfUser.reqRecievedId.indexOf(friendUser.userId);
      selfUser.reqRecievedId.splice(index, 1);

      index = friendUser.reqSendId.indexOf(selfUser.userId);
      friendUser.reqSendId.splice(index, 1);

      await selfUser.save();
      await friendUser.save();

      return NextResponse.json({
        status: true,
        msg: "Successfully Rejected the invitation",
      });

      //
    } // //
    else if (body.action === "Send-Invitation Cancelled") {
      //

      const selfUser = await UserData.findOne({ userId: tokenData._id });
      const friendUser = await UserData.findOne({ userId: body.targetUserId });

      const selfNotify = await UserNotify.findByIdAndUpdate(
        {
          _id: selfUser.notifications.notifyId,
        },
        { $pull: { [`invitation.send`]: { userId: friendUser.userId } } }
      );

      const friendNotify = await UserNotify.findOneAndUpdate(
        {
          _id: friendUser.notifications.notifyId,
          [`invitation.recieved.userId`]: selfUser.userId,
          [`invitation.recieved.active`]: true,
        },
        { $set: { [`invitation.recieved.$.active`]: 0 } }
      );

      selfUser.notifications.count -= 1;

      let index;

      index = selfUser.reqSendId.indexOf(friendUser.userId);
      selfUser.reqSendId.splice(index, 1);

      index = friendUser.reqRecievedId.indexOf(selfUser.userId);
      friendUser.reqRecievedId.splice(index, 1);

      await selfUser.save();
      await friendUser.save();

      return NextResponse.json({
        status: true,
        msg: "Successfully Cancel the invitation",
      });

      //
    } //
    else if (body.action === "Rejected-Invitation Deleted") {
      //

      const selfUser = await UserData.findOne({ userId: tokenData._id });

      const selfNotify = await UserNotify.findByIdAndUpdate(
        {
          _id: selfUser.notifications.notifyId,
          [`invitation.send.active`]: false,
        },
        {
          $pull: {
            [`invitation.send`]: { userId: body.targetUserId },
          },
        }
      );

      selfUser.notifications.count -= 1;

      return NextResponse.json({
        status: true,
        msg: "Successfully Delete the Rejected-Invitation",
      });

      //
    } //
    else if (body.action === "Cancel-Invitation Deleted") {
      //

      const selfUser = await UserData.findOne({ userId: tokenData._id });

      const selfNotify = await UserNotify.findByIdAndUpdate(
        {
          _id: selfUser.notifications.notifyId,
          [`invitation.recieved.active`]: false,
        },
        { $pull: { [`invitation.recieved`]: { userId: body.targetUserId } } }
      );

      selfUser.notifications.count -= 1;

      return NextResponse.json({
        status: true,
        msg: "Successfully Delete the Cancel-Invitation",
      });

      //
    }

    //
  } catch (err) {
    console.log(err);
  }
}
// *****************************
// PUT Request : End here
// *****************************

/*
nit
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDYzMGFkZWRkMTg4YmFiODkzZjRhMDEiLCJ1c2VybmFtZSI6Im5pdCIsImlhdCI6MTY4NDIxMjUxOCwiZXhwIjoxNjg0Mjk4OTE4fQ.r7DhVIlgNMAzOp3lDcH74OT0tC7gl5URN46n6D0Cx2c

savi
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDYzMGFlYWRkMTg4YmFiODkzZjRhMDgiLCJ1c2VybmFtZSI6InNhdmkiLCJpYXQiOjE2ODQyMTI2MzUsImV4cCI6MTY4NDI5OTAzNX0.sZOifjfZqzp79jZezRHCG8FBusQbhoW1ZplJ8zSxsfU

kavi
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDYzMGFmMmRkMTg4YmFiODkzZjRhMGYiLCJ1c2VybmFtZSI6ImthdmkiLCJpYXQiOjE2ODQyMTI3MzcsImV4cCI6MTY4NDI5OTEzN30.ustYl0ipI5r-EWb4N3GiTn3T5B5kPzgX3iMZgVhRtac

rani
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDYzODRjY2Y2Y2Y2NmIxMTQwZTJjZmIiLCJ1c2VybmFtZSI6InJhbmkiLCJpYXQiOjE2ODQyNDM4NTcsImV4cCI6MTY4NDMzMDI1N30.mL1oEJKVjXYvWdot4Z2oULa-blR-d1_lYAW1clk63Yo

kari
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDYzODRkYmY2Y2Y2NmIxMTQwZTJkMDIiLCJ1c2VybmFtZSI6ImthcmkiLCJpYXQiOjE2ODQyNDM5ODEsImV4cCI6MTY4NDMzMDM4MX0.N1JXYx-wU3ASbCaE0saQetubtBe8O2cMPJBV4x42dIg
*/
