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
      { onlineStatus: 1, avtar: 1, _id: 0 }
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
    let messageBox = selfUser.friends[0].chatStatus;

    await Chat.updateMany(
      {
        _id: chatId,
      },
      {
        $set: {
          [`message.$[e].seenStauts`]: true,
        },
      },
      { arrayFilters: [{ [`e.author`]: pUsername }] }
    );

    await Chat.updateMany(
      {
        _id: chatId,
      },
      {
        $set: {
          [`${
            messageBox === "messageOne" ? "messageTwo" : "messageOne"
          }.$[e].seenStauts`]: true,
        },
      },
      { arrayFilters: [{ [`e.author`]: pUsername }] }
    );

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
      data: chats[messageBox],
      avtar: targetUser.avtar,
      selfId: tokenData._id,
      chatId: chatId,
      chatStatus: messageBox,
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

    let tarik = new Date().toLocaleDateString("pt-PT");

    let chatData = {
      sendTime: body.sendTime,
      userId: selfUser.userId,
      author: selfUser.username,
      msg: body.message,
      msgType: body.msgType,
      mediaInfo: body.mediaInfo,
      reaction: body.reaction,
      time: body.time,
      date: tarik,
    };

    chats.message.push(chatData);
    chats.messageOne.push(chatData);
    chats.messageTwo.push(chatData);

    let lastMsg =
      body.message === "noCapTiOn9463"
        ? body.mediaInfo.name + " " + body.mediaInfo.size
        : body.message;

    await UserData.findOneAndUpdate(
      { username: selfUser.username, [`friends.chatId`]: chatId },
      {
        $set: {
          [`friends.$.lastMsg`]: lastMsg,
        },
      }
    );

    await UserData.findOneAndUpdate(
      { username: pUsername, [`friends.chatId`]: chatId },
      {
        $set: {
          [`friends.$.lastMsg`]: lastMsg,
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

  // const token = req.cookies.get("token")?.value || req.headers.cookies.token;
  // const tokenData = jwt.verify(token, process.env.JWTSECRET);
  // const pUsername = context.searchParams.username;

  try {
    //

    const body = await req.json();
    // const chats = await Chat.findOne({ _id: body.chatId });

    if (body.action === "Delete self message") {
      //

      // delete from my message box
      await Chat.findOneAndUpdate(
        { _id: body.chatId },
        {
          $pull: {
            [`${body.chatStatus}`]: {
              _id: body._id,
            },
          },
        }
      );

      // await Chat.updateMany(
      //   {
      //     _id: chatId,
      //   },
      //   {
      //     $set: {
      //       [`${
      //         messageBox === "messageOne" ? "messageTwo" : "messageOne"
      //       }.$[e].seenStauts`]: false,
      //     },
      //   },
      //   { arrayFilters: [{ [`e.author`]: pUsername }] }
      // );

      const temp = await Chat.updateMany(
        {
          _id: body.chatId,
        },
        {
          $set: {
            [`${
              body.chatStatus === "messageOne" ? "messageTwo" : "messageOne"
            }.$[e].deleted`]: true,
          },
        },
        { arrayFilters: [{ [`e._id`]: body._id }] }
      );

      console.log(temp);

      return NextResponse.json({
        status: true,
        msg: "Successfully: Delete Self message.",
      });

      //
    } //
    else if (body.action === "Delete your message") {
      //

      await Chat.findOneAndUpdate(
        { _id: body.chatId },
        {
          $pull: {
            [`${body.chatStatus}`]: {
              _id: body._id,
            },
          },
        }
      );

      return NextResponse.json({
        status: true,
        msg: "Successfully: Delete your message.",
      });

      //
    } //

    //
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      status: false,
      msg: "ERROR : Something went wrong with Chats - > Delete.",
    });
  }

  // End of the API Routes
}
// *****************************
// PUT Request : End here
// *****************************
