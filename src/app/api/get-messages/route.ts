import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

import { User } from "next-auth";
import mongoose from "mongoose";

import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 },
    );
  }

  try {
    const userId = new mongoose.Types.ObjectId(user._id);

    const messages = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No messages found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        messages: messages[0].messages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching messages:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
