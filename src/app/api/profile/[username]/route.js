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
export async function GET(req, context) {
  // Database is Connecting.
  dbConnect();
  console.log("Database is Connected");

  try {
    //

    const token = req.cookies.get("token")?.value || req.headers.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWTSECRET);
    const pUsername =
      context.params.username === "selfUser"
        ? tokenData.username
        : context.params.username;

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
        private: 1,
      }
    );

    const selfUser = await UserData.findOne(
      { userId: tokenData._id },
      {
        userId: 1,
        username: 1,
        friendsId: 1,
        blockUserId: 1,
      }
    );

    // console.log(selfUser);

    let data = user ? user._doc : {};

    if (!user) {
      //

      return NextResponse.json({
        status: false,
        msg: "Successfully user not found",
      });

      //
    } //
    else if (user.username === selfUser.username) {
      //

      data = { ...data, status: "self" };

      return NextResponse.json({
        status: true,
        msg: "Successfully send author profile",
        data: data,
      });

      //
    } //
    else if (selfUser.friendsId.includes(user.userId)) {
      //

      if (selfUser.blockUserId.includes(user.userId)) {
        data = { ...data, status: "blocked by you" };

        return NextResponse.json({
          status: true,
          msg: "Successfully You blocked this account",
          data: data,
        });
      }

      if (user.blockUserId.includes(selfUser.userId)) {
        data = { ...data, status: "blocked by him" };

        return NextResponse.json({
          status: true,
          msg: "Successfully this user blocked your account",
          data: data,
        });
      }

      data = { ...data, status: "friend" };

      return NextResponse.json({
        status: true,
        msg: "Successfully send friend profile",
        data: data,
      });

      //
    } //
    else if (!user.private) {
      data = { ...data, status: "Unknown" };

      return NextResponse.json({
        status: true,
        msg: "Successfully send Unknown profile",
        data: data,
      });
    } //
    else {
      //

      return NextResponse.json({
        status: false,
        msg: "This is Private Account.",
      });

      //
    }

    //
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      status: false,
      msg: "ERROR : Something went wrong in get->profile/route.js",
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
export async function PUT(req, context) {
  // Database is Connecting.
  dbConnect();
  console.log("Database is Connected");

  try {
    //

    const token = req.cookies.get("token")?.value || req.headers.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWTSECRET);

    const body = await req.json();

    if (body.action === "Block User") {
      //

      const selfUser = await UserData.findOneAndUpdate(
        { userId: tokenData._id },
        {
          $push: {
            blockUserId: body.targetUserId,
          },
        }
      );

      await UserData.findOneAndUpdate(
        { userId: tokenData._id, [`friends.userId`]: body.targetUserId },
        {
          $set: {
            [`friends.$.blockStatus`]: true,
          },
        }
      );

      await UserData.findOneAndUpdate(
        { userId: body.targetUserId, [`friends.userId`]: tokenData._id },
        {
          $set: {
            [`friends.$.blockStatus`]: true,
          },
        }
      );

      return NextResponse.json({
        status: true,
        msg: "Successfully! : Block the user",
      });

      //
    } //
    else if (body.action === "Unblock User") {
      //

      const selfUser = await UserData.findOneAndUpdate(
        { userId: tokenData._id },
        {
          $pull: {
            blockUserId: body.targetUserId,
          },
        }
      );

      const targetUser = await UserData.findOne(
        { userId: body.targetUserId },
        { blockUserId: 1 }
      );

      if (targetUser.blockUserId.includes(tokenData._id)) {
        return NextResponse.json({
          status: true,
          msg: "Successfully! : Half Unblock the user",
        });
      }

      await UserData.findOneAndUpdate(
        { userId: tokenData._id, [`friends.userId`]: body.targetUserId },
        {
          $set: {
            [`friends.$.blockStatus`]: false,
          },
        }
      );

      await UserData.findOneAndUpdate(
        { userId: body.targetUserId, [`friends.userId`]: tokenData._id },
        {
          $set: {
            [`friends.$.blockStatus`]: false,
          },
        }
      );

      return NextResponse.json({
        status: true,
        msg: "Successfully! : Unblock the user",
      });

      //
    } //
    else if (body.action === "Update Avtar") {
      //

      const targetUser = await UserData.findOne(
        { userId: body.targetUserId },
        {
          avtar: 1,
        }
      );

      // console.log(targetUser);

      await UserData.findOneAndUpdate(
        { userId: tokenData._id, [`friends.userId`]: body.targetUserId },
        {
          $set: {
            [`friends.$.avtar`]: targetUser.avtar,
          },
        }
      );

      return NextResponse.json({
        status: true,
        msg: "Successfully! : Update Avtar.",
        avtar: targetUser.avtar,
      });
    } //
    else if (body.action === "Update Avtar in notify") {
      //

      const targetUser = await UserData.findOne(
        { userId: body.targetUserId },
        {
          avtar: 1,
        }
      );

      // console.log(targetUser);

      let section = body.notifySection === "Send" ? "send" : "recieved";

      await UserNotify.findOneAndUpdate(
        {
          _id: body.notifyId,
          [`invitation.${section}.userId`]: body.targetUserId,
        },
        { $set: { [`invitation.${section}.$.avtar`]: targetUser.avtar } }
      );

      return NextResponse.json({
        status: true,
        msg: "Successfully! : Update Avtar.",
      });
    } //
    else if (body.action === "Update About") {
      //

      await UserData.findOneAndUpdate(
        { userId: tokenData._id },
        {
          $set: {
            about: body.about,
          },
        }
      );

      return NextResponse.json({
        status: true,
        msg: "Successfully! : Update About Section.",
      });
    }

    //
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      status: false,
      msg: "ERROR : Something went wrong in put->profile/route.js",
    });

    //
  }
  //

  // End of the Route
}
// *****************************
// PUT Request : End here
// *****************************
