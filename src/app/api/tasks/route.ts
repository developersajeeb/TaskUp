import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";

// Get Data by specific user
export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("taskManagement");

    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");

    const query = userEmail ? { userEmail } : {};

    const tasks = await db.collection("tasks").find(query).sort({ _id: -1 }).toArray();
    
    return NextResponse.json({ success: true, data: tasks });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Post task
export async function POST(req: Request) {
  try {
    const { taskName, description, dueDate, priority, taskCategory, userEmail } = await req.json();
    
    if (!taskName || !taskCategory) {
      return NextResponse.json({ success: false, message: 'Task name and category are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("taskManagement");
    
    const newTask = { taskName, description, dueDate, priority, taskCategory, createdAt: new Date().toISOString(), userEmail };
    const result = await db.collection("tasks").insertOne(newTask);

    return NextResponse.json({ success: true, message: 'Task added successfully', taskId: result.insertedId });
  } catch (error: any) {
    console.error('Error adding task:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to add task' }, { status: 500 });
  }
}