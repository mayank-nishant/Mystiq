import UserModel, { Message } from "@/model/User";
import dbConnect from "@/lib/dbConnect";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();

    const user = await UserModel.findOne({
      username,
    }).exec();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    if (!user.isAcceptingMessages) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 },
      );
    }

    const newMessage: Message = {
      content,
      createdAt: new Date(),
    } as Message;

    user.messages.push(newMessage);

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error sending message:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
