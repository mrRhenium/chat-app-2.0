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

    let data = notify.invitation;
    // console.log(user);

    data = { ...data, notifyId: user.notifications.notifyId };
    //
    return NextResponse.json({
      status: true,
      msg: "Successfully! : Send the Notifications.",
      data: data,
    });

    //
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      status: false,
      msg: `ERROR: ${err}`,
    });
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

    const token = req.cookies.get("token")?.value || req.headers.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWTSECRET);

    const body = await req.json();

    if (body.action === "Recieved-Invitation Accepted") {
      const selfUser = await UserData.findOne({ userId: tokenData._id });
      const friendUser = await UserData.findOne({ userId: body.targetUserId });

      const selfNotify = await UserNotify.findByIdAndUpdate(
        {
          _id: selfUser.notifications.notifyId,
          [`invitation.recieved.active`]: true,
        },
        {
          $pull: {
            [`invitation.recieved`]: {
              userId: friendUser.userId,
            },
          },
        }
      );

      const friendNotify = await UserNotify.findByIdAndUpdate(
        {
          _id: friendUser.notifications.notifyId,
          [`invitation.send.active`]: true,
        },
        {
          $pull: {
            [`invitation.send`]: { userId: selfUser.userId },
          },
        }
      );

      const userChat = await Chat.create({
        message: [],
      });

      const friend = {
        userId: friendUser.userId,
        username: friendUser.username,
        avtar: friendUser.avtar,
        chatId: userChat._id,
        username: friendUser.username,
        invited: 0,
        chatStatus: "messageOne",
      };

      const self = {
        userId: selfUser.userId,
        username: selfUser.username,
        avtar: selfUser.avtar,
        chatId: userChat._id,
        username: selfUser.username,
        invited: 1,
        chatStatus: "messageTwo",
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
        msg: "Successfully! : Accepted the invitation",
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
        msg: "Successfully! : Rejected the invitation",
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
        msg: "Successfully! : Cancel the invitation",
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
        msg: "Successfully! : Delete the Rejected-Invitation",
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
        msg: "Successfully! : Delete the Cancel-Invitation",
      });

      //
    }

    return NextResponse.json({
      status: false,
      msg: `ERROR : Some error occurs.`,
    });

    //
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      status: false,
      msg: `ERROR : Something went wrong.`,
    });
  }
}
// *****************************
// PUT Request : End here
// *****************************
