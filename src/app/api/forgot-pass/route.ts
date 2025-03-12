import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        const currentTime = new Date().toISOString();
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

        // Generate token and expiry time
        const resetToken = crypto.randomBytes(20).toString("hex");
        const tokenExpiry = new Date(new Date().getTime() + 3600000).toISOString(); // 1-hour expiry

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

        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/new-password/${resetToken}/`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            html: `
                <p>Hello,</p>
                <p>Click the link below to reset your password:</p>
                <p><a href="${resetLink}">${resetLink}</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>Current Server Time: ${currentTime}</p>
            `,
        });

        return NextResponse.json({ message: "Password reset email sent!" }, { status: 200 });
    } catch (error) {
        console.error("Error in forgot password API:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}