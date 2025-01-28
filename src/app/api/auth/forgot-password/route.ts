import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db("taskManagement");
        const usersCollection = db.collection("users");

        // Find user
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Generate token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const tokenExpiry = new Date(Date.now() + 3600000); // 1-hour expiry

        // Update user with reset token and expiry
        await usersCollection.updateOne(
            { email },
            { $set: { resetToken, tokenExpiry } }
        );

        // Send email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const resetLink = `http://localhost:3000/new-password?token=${resetToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p><br><p>Expire in 1 hour!</p>`,
        });

        return NextResponse.json({ message: "Password reset email sent!" }, { status: 200 });
    } catch (error) {
        console.error("Error in forgot password API:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}