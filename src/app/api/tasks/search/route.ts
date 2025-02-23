import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Get Data by specific user, task name, and priority
export async function GET(req: NextRequest) {
    try {
      const client = await clientPromise;
      const db = client.db("taskManagement");
  
      const { searchParams } = new URL(req.url);
      const userEmail = searchParams.get("userEmail");
      const taskName = searchParams.get("taskName");
      const priority = searchParams.get("priority");
  
      const query: any = {};
  
      if (userEmail) query.userEmail = userEmail;
      if (taskName) query.taskName = { $regex: taskName, $options: "i" };
      if (priority) query.priority = { $regex: `^${priority}$`, $options: "i" };
  
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
  