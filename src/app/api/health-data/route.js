import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const healthData = await prisma.healthData.findMany({
      where: {
        userId: req.auth.user.id,
      },
      orderBy: {
        date: "desc",
      },
      take: 7, // Get the last 7 days of data
    });

    return NextResponse.json(
      { message: "Health data retrieved successfully", data: healthData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving health data:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
});

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validate input
    if (
      !body.heartRate ||
      !body.sleepDuration ||
      !body.sleepQuality ||
      !body.activityLevel ||
      !body.stressLevel
    ) {
      return NextResponse.json(
        { error: "Invalid input: all fields are required" },
        { status: 400 }
      );
    }

    // Check if an entry already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingEntry = await prisma.healthData.findFirst({
      where: {
        userId: req.auth.user.id,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: "Health data has already been submitted for today" },
        { status: 400 }
      );
    }

    const healthData = await prisma.healthData.create({
      data: {
        userId: req.auth.user.id,
        date: new Date(),
        heartRate: parseInt(body.heartRate),
        sleepDuration: parseFloat(body.sleepDuration),
        sleepQuality: body.sleepQuality,
        activityLevel: body.activityLevel,
        stressLevel: body.stressLevel,
      },
    });

    return NextResponse.json(
      { message: "Health data submitted successfully", data: healthData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting health data:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
});
