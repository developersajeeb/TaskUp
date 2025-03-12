import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextApiRequest } from "next";

// Todo Complete/Incomplete
export async function PATCH(req: any, {params}: any) {
    try {
        const { id } = await params;

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

// Delete Single Todo
export async function DELETE(req: any, { params }: any) {
    try {
        const { id } = await params;
        const { todoIndex } = await req.json();

        // Validate ID and index
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid Task ID provided" },
                { status: 400 }
            );
        }

        if (typeof todoIndex !== "number") {
            return NextResponse.json(
                { success: false, message: "Todo index is required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("taskManagement");

        // Retrieve the task to get the todo item based on the index
        const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) });

        if (!task) {
            return NextResponse.json(
                { success: false, message: "Task not found" },
                { status: 404 }
            );
        }

        // Ensure the index is within bounds
        if (!task.todoList || todoIndex < 0 || todoIndex >= task.todoList.length) {
            return NextResponse.json(
                { success: false, message: "Invalid todo index" },
                { status: 400 }
            );
        }

        // Remove the todo item at the specified index
        const updatedTodoList = task.todoList.filter((_: any, index: number) => index !== todoIndex);

        // Update the task with the modified todoList
        const updateResult = await db.collection("tasks").updateOne(
            { _id: new ObjectId(id) },
            { $set: { todoList: updatedTodoList } }
        );

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Todo item could not be deleted" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Todo deleted successfully!" });
    } catch (error) {
        console.error("Error deleting todo:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete todo" },
            { status: 500 }
        );
    }
}