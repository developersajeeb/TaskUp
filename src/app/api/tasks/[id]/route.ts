import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextApiRequest } from "next";

// Delete The Task
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;

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

// Update the Task
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

  try {
    const client = await clientPromise;
    const db = client.db("taskManagement");

    const { taskName, description, dueDate, priority, taskCategory } = await req.json();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, message: "Task ID is required." }, { status: 400 });
    }

    const updateFields: any = {};
    if (taskName) updateFields.taskName = taskName;
    if (description) updateFields.description = description;
    if (dueDate) updateFields.dueDate = new Date(dueDate);
    if (priority) updateFields.priority = priority;
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

// Get The Single Task
export async function GET(
  req: NextRequest,
  { params }: { params?: { id?: string }}
) {
  try {
    const paramsValue = await params;
    if (!paramsValue || !paramsValue.id) {
      return NextResponse.json({ success: false, message: "Task ID is required." }, { status: 400 });
    }

    const { id } = paramsValue;

    const client = await clientPromise;
    const db = client.db("taskManagement");

    const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) });

    if (!task) {
      return NextResponse.json({ success: false, message: "Task not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: task });
  } catch (error: any) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Add The Todo Data
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
      const { id } = params;

      if (!id || !ObjectId.isValid(id)) {
          return NextResponse.json({ success: false, message: "Invalid Task ID" }, { status: 400 });
      }

      const { todoList, updateWorkDone } = await req.json();

      const client = await clientPromise;
      const db = client.db("taskManagement");

      if (updateWorkDone) {
          const { todoIndex, workDone } = updateWorkDone;

          if (typeof todoIndex !== "number") {
              return NextResponse.json({ success: false, message: "Todo index is required" }, { status: 400 });
          }

          const updateResult = await db.collection("tasks").updateOne(
              { _id: new ObjectId(id) },
              { $set: { [`todoList.${todoIndex}.workDone`]: workDone } }
          );

          if (updateResult.modifiedCount === 0) {
              return NextResponse.json({ success: false, message: "Todo item not found or no changes made" }, { status: 404 });
          }

          return NextResponse.json({ success: true, message: "Todo status updated successfully!" });
      }

      if (todoList) {
          const updatedTask = await db.collection("tasks").updateOne(
              { _id: new ObjectId(id) },
              { $push: { todoList: { $each: todoList, $position: 0 } } as any }
          );

          if (updatedTask.modifiedCount === 0) {
              return NextResponse.json({ success: false, message: "Task not found or no changes made." }, { status: 404 });
          }

          return NextResponse.json({ success: true, message: "Todo list item added successfully!" });
      }

      return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  } catch (error: any) {
      console.error("Error handling PATCH request:", error);
      return NextResponse.json(
          { success: false, message: error.message || "Failed to process request" },
          { status: 500 }
      );
  }
}
