import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
    const { acceptMessages } = await request.json();

    const userId = user._id;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      {
        new: true,
      },
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update message acceptance status",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating message acceptance status:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update message acceptance status",
      },
      { status: 500 },
    );
  }
}

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
    const userId = user._id;

    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error getting message acceptance status:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error getting message acceptance status",
      },
      { status: 500 },
    );
  }
}
