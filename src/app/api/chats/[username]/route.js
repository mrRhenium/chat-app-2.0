import dbConnect from "@/Database/dbCoonect";
import Chat from "@/Models/userChat_model";
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
  // console.log("Database is Connected");

  try {
    //

    const token = req.cookies.get("token")?.value || req.headers.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWTSECRET);
    const pUsername = context.params.username;
    // console.log("Context : ", context);

    const selfUser = await UserData.findOne(
      {
        userId: tokenData._id,
      },
      {
        friends: { $elemMatch: { username: pUsername } },
      }
    );

    const targetUser = await UserData.findOne(
      { username: pUsername },
      { onlineStatus: 1, _id: 0 }
    );

    // console.log("friend -> " + selfUser);

    if (selfUser.friends.length === 0) {
      return NextResponse.json({
        status: false,
        msg: "Successfully! : User is not connected with you",
      });
    }

    // const onlineStatus = selfUser.friends[0].onlineStatus;
    const chatId = selfUser.friends[0].chatId;
    const chats = await Chat.findOne({ _id: chatId });

    // await Chat.updateMany(
    //   {
    //     _id: chatId,
    //   },
    //   {
    //     $set: {
    //       [`message.$[e].seenStauts`]: true,
    //     },
    //   },
    //   { arrayFilters: [{ [`e.author`]: pUsername }] }
    // );

    await UserData.findOneAndUpdate(
      { userId: tokenData._id, [`friends.chatId`]: chatId },
      {
        $set: {
          [`friends.$.count`]: 0,
        },
      }
    );

    return NextResponse.json({
      status: true,
      msg: "Successfully! : Send Users chat.",
      data: chats,
      onlineStatus: targetUser.onlineStatus,
    });

    //
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      status: false,
      msg: "ERROR! : Something went wrong with Chats.",
    });
  }
}
// *****************************
// GET Request : End here
// *****************************

// *****************************
// POST Request : Start here
// *****************************
export async function POST(req, context) {
  // Database is Connecting.
  dbConnect();
  console.log("Database is Connected");

  try {
    //

    const token = req.cookies.get("token")?.value || req.headers.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWTSECRET);
    const pUsername = context.params.username;
    // console.log("Context : ", context);

    const selfUser = await UserData.findOne(
      {
        userId: tokenData._id,
      },
      {
        userId: 1,
        username: 1,
        friends: { $elemMatch: { username: pUsername } },
      }
    );

    // console.log(selfUser);

    const body = await req.json();
    const chatId = selfUser.friends[0].chatId;
    const block = selfUser.friends[0].blockStatus;

    if (block) {
      return NextResponse.json({
        status: false,
        msg: "Access to this user is prohibited.",
      });
    }

    const chats = await Chat.findOne({ _id: chatId });

    let date = new Date();
    let tarik = date.toLocaleDateString("pt-PT");

    chats.message.push({
      userId: selfUser.userId,
      author: selfUser.username,
      msg: body.message,
      backUpMsg: body.message,
      time: body.time,
      date: tarik,
    });

    await UserData.findOneAndUpdate(
      { username: selfUser.username, [`friends.chatId`]: chatId },
      {
        $set: {
          [`friends.$.lastMsg`]: body.message,
        },
      }
    );

    await UserData.findOneAndUpdate(
      { username: pUsername, [`friends.chatId`]: chatId },
      {
        $set: {
          [`friends.$.lastMsg`]: body.message,
        },
        $inc: {
          [`friends.$.count`]: 1,
        },
      }
    );

    await chats.save();

    return NextResponse.json({
      status: true,
      msg: "Successfully send the message",
      data: chats,
    });

    //
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      status: false,
      msg: "ERROR : Something went wrong with chatPost.",
    });
  }

  // End of the API Routes
}
// *****************************
// POST Request : End here
// *****************************

// *****************************
// PUT Request : Start here
// *****************************
export async function PUT(req, context) {
  // Database is Connecting.
  dbConnect();
  console.log("Database is Connected");

  // const pUsername = context.searchParams.username;
  // console.log("Context : ", context);

  try {
    //

    const body = await req.json();

    if (body.action === "Delete whole chats") {
      //

      const chats = await Chat.findOneAndUpdate(
        { _id: body.chatId },
        { $set: { message: [] } }
      );

      return NextResponse.json({
        status: true,
        msg: "Successfully delete whole chats",
      });

      //
    } else if (body.action === "Delete particular chats") {
      //

      const chats = await Chat.findOne({ _id: body.chatId });

      const updChats = chats.message.map((item) => {
        if (body.msgArray.includes(item.indexId)) {
          //

          if (item.msgStatus === "active") {
            item.msgStatus = "temp del";
            item.msg = "this message deleted";
          } else if (item.msgStatus === "temp del") {
            item.msgStatus = "perm del";
          }

          //
        }

        return item;
      });

      chats.message = updChats;
      await chats.save();

      return NextResponse.json({
        status: true,
        msg: "Successfully delete particular chats",
      });

      //
    }

    //
  } catch (err) {
    console.log(err);
  }

  // End of the API Routes
}
// *****************************
// PUT Request : End here
// *****************************
