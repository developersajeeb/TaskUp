import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { password, token } = await req.json();


        if (!token || !password) {
            return NextResponse.json(
                { error: "Password or token is missing" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("taskManagement");
        const usersCollection = db.collection("users");

        // Find the user with the resetToken
        const user = await usersCollection.findOne({ resetToken: token });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 }
            );
        }

        // Check if the token has expired
        if (new Date() > new Date(user.tokenExpiry)) {
            return NextResponse.json(
                { error: "Token has expired" },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password and clear the resetToken and tokenExpiry fields
        await usersCollection.updateOne(
            { resetToken: token },
            {
                $set: { password: hashedPassword },
                $unset: { resetToken: "", tokenExpiry: "" },
            }
        );

        return NextResponse.json(
            { message: "Password changed successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in reset-password API:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}