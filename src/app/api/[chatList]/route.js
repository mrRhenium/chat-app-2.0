import dbConnect from "@/Database/dbCoonect";
import UserData from "@/Models/usersData_model";

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
  console.log("Database is Connected : GET -> api/chatList");

  try {
    //

    const token = req.cookies.get("token")?.value || req.headers.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWTSECRET);

    const selfUser = await UserData.aggregate([
      {
        $match: { username: tokenData.username },
      },
      {
        $set: {
          friends: {
            $sortArray: {
              input: "$friends",
              // sortBy: { updatedAt: -1 },
              sortBy: { timer: -1 },
            },
          },
        },
      },
    ]);

    const data = {
      userId: selfUser[0].userId,
      name: selfUser[0].name,
      username: selfUser[0].username,
      avtar: selfUser[0].avtar,
      friends: selfUser[0].friends,
      notifyCount: selfUser[0].notifications.count,
    };

    console.log("selfUser" + selfUser);

    return NextResponse.json({
      status: true,
      msg: "Successfully! : Send all user's chatlist",
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
