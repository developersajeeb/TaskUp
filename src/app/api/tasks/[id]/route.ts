import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Task ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("taskManagement");

    const result = await db.collection("tasks").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Task not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Task deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete task" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    const client = await clientPromise;
    const db = client.db("taskManagement");
    
    const { taskName, description, dueDate, taskCategory } = await req.json();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, message: "Task ID is required." }, { status: 400 });
    }

    const updateFields: any = {};
    if (taskName) updateFields.taskName = taskName;
    if (description) updateFields.description = description;
    if (dueDate) updateFields.dueDate = new Date(dueDate);
    if (taskCategory) updateFields.taskCategory = taskCategory;

    const updatedTask = await db.collection("tasks").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (updatedTask.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "No changes made or task not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Task updated successfully!" });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update task." },
      { status: 500 }
    );
  }
}
