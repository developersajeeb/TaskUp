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
  
