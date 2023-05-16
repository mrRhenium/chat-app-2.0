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
  console.log("Database is Connected");

  const token = req.cookies.get("token")?.value || req.headers.cookies.token;
  const tokenData = jwt.verify(token, process.env.JWTSECRET);

  try {
    //

    const selfUser = await UserData.aggregate([
      {
        $match: { username: tokenData.username },
      },
      {
        $set: {
          friends: {
            $sortArray: {
              input: "$friends",
              sortBy: { updatedAt: -1 },
            },
          },
        },
      },
    ]);

    const data = {
      userId: selfUser[0].userId,
      name: selfUser[0].name,
      username: selfUser[0].username,
      friends: selfUser[0].friends,
      notifyCount: selfUser[0].notifications.count,
    };

    return NextResponse.json({
      status: true,
      msg: "Successfully send user data",
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
