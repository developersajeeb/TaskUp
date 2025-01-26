import { NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("taskManagement");

    const tasks = await db.collection("tasks").find({}).toArray();
    return NextResponse.json({ status: 200, data: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}
