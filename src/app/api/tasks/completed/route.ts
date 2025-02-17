import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";

// Get all completed tasks for a specific user
export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("taskManagement");

        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get("userEmail");

        if (!userEmail) {
            return NextResponse.json({ success: false, message: "User email is required" }, { status: 400 });
        }

        const tasks = await db.collection("tasks").find({
            userEmail,
            todoList: { $not: { $elemMatch: { workDone: false } } }, // Ensures all todos are completed
        }).sort({ _id: -1 }).toArray();

        return NextResponse.json({ success: true, data: tasks });
    } catch (error) {
        console.error('Error fetching completed tasks:', error);
        return NextResponse.json(
            { success: false, message: (error instanceof Error ? error.message : 'Internal Server Error') },
            { status: 500 }
        );
    }
}
