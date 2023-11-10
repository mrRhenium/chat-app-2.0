import dbConnect from "@/Database/dbCoonect";
import UserData from "@/Models/usersData_model";
import UserNotify from "@/Models/userNotify_model";
import Chat from "@/Models/userChat_model";

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
  console.log("Database is Connected : GET -> api/notification");

  try {
    //

    const token = req.cookies.get("token")?.value || req.headers.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWTSECRET);

    const selfUser = await UserData.findOne(
      { userId: tokenData._id },
      {
        friendsId: 1,
        reqSendId: 1,
        reqRecievedId: 1,
      }
    );

    const allUsers = await UserData.find(
      {},
      {
        _id: 0,
        name: 1,
        username: 1,
        userId: 1,
        avtar: 1,
      }
    ).sort({ name: 1 });

    const data = [];

    allUsers.map((item) => {
      let friendStatus = 0;
      let invitation = "none";

      if (selfUser.friendsId.includes(item.userId)) friendStatus = 1;
      if (selfUser.reqSendId.includes(item.userId)) invitation = "Send";
      if (selfUser.reqRecievedId.includes(item.userId)) invitation = "Recieved";

      if (item.userId != tokenData._id) {
        data.push({
          name: item.name,
          username: item.username,
          userId: item.userId,
          avtar: item.avtar,
          friend: friendStatus,
          invitation: invitation,
        });
      }

      return item;
    });

    return NextResponse.json({
      status: true,
      msg: "Successfully! : Send all Users",
      data: data,
    });

    //
  } catch (err) {
    //

    console.log(err);

    return NextResponse.json({
      status: false,
      msg: `ERROR! : ${err}`,
    });

    //
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
  console.log("Database is Connected  : POST -> api/notification");

  try {
    //

    const token = req.cookies.get("token")?.value || req.headers.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWTSECRET);

    const body = await req.json();
    const searchItem = body.search;

    const selfUser = await UserData.findOne(
      { userId: tokenData._id },
      {
        friendsId: 1,
        reqSendId: 1,
        reqRecievedId: 1,
      }
    );

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
    ).sort({ name: 1 });

    const data = [];

    allUsers.map((item) => {
      let friendStatus = 0;
      let invitation = "none";

      if (selfUser.friendsId.includes(item.userId)) friendStatus = 1;
      if (selfUser.reqSendId.includes(item.userId)) invitation = "Send";
      if (selfUser.reqRecievedId.includes(item.userId)) invitation = "Recieved";

      if (item.userId != tokenData._id) {
        data.push({
          name: item.name,
          username: item.username,
          userId: item.userId,
          avtar: item.avtar,
          friend: friendStatus,
          invitation: invitation,
        });
      }

      return item;
    });

    return NextResponse.json({
      status: true,
      msg: "Successfully! : Send matching users.",
      data: data,
    });

    //
  } catch (err) {
    //

    console.log(err);

    return NextResponse.json({
      status: false,
      msg: `ERROR: ${err}`,
    });

    //
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
  console.log("Database is Connected : PUT -> api/notification");

  try {
    //

    const token = req.cookies.get("token")?.value || req.headers.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWTSECRET);

    const body = await req.json();

    if (body.action === "Invite User") {
      const selfUser = await UserData.findOne(
        { userId: tokenData._id },
        {
          reqSendId: 1,
          notifications: 1,
          userId: 1,
          name: 1,
          username: 1,
          avtar: 1,
        }
      );
      const targetUser = await UserData.findOne(
        { userId: body.targetUserId },
        {
          reqRecievedId: 1,
          notifications: 1,
          userId: 1,
          name: 1,
          username: 1,
          avtar: 1,
        }
      );

      selfUser.notifications.count += 1;
      targetUser.notifications.count += 1;

      const selfNotify = await UserNotify.findOneAndUpdate(
        {
          _id: selfUser.notifications.notifyId,
        },
        {
          $push: {
            [`invitation.send`]: {
              userId: body.targetUserId,
              name: targetUser.name,
              username: targetUser.username,
              avtar: targetUser.avtar,
              time: body.time,
            },
          },
        }
      );

      const targetNotify = await UserNotify.findOneAndUpdate(
        {
          _id: targetUser.notifications.notifyId,
        },
        {
          $push: {
            [`invitation.recieved`]: {
              userId: tokenData._id,
              name: selfUser.name,
              username: selfUser.username,
              avtar: selfUser.avtar,
              time: body.time,
            },
          },
        }
      );

      selfUser.reqSendId.push(body.targetUserId);
      targetUser.reqRecievedId.push(tokenData._id);

      selfUser.save();
      targetUser.save();

      return NextResponse.json({
        status: true,
        msg: "Successfully! : Send the request to the target user.",
      });
    } // //
    else if (body.action === "Recieved-Invitation Accepted") {
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
    }

    return NextResponse.json({
      status: false,
      msg: `ERROR : Some error occurs.`,
    });

    //
  } catch (err) {
    //

    console.log(err);

    return NextResponse.json({
      status: false,
      msg: `ERROR : ${err}`,
    });

    //
  }

  // End of the Route
}
// *****************************
// PUT Request : End here
// *****************************
