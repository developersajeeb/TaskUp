import bcrypt from 'bcrypt';
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Input Validation
        const { name, email, password } = body;
        if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields are required." }, { status: 400 });
        }

        // MongoDB Connection
        const client = await clientPromise;
        const db = client.db("taskManagement");

        // Check if the email already exists
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "Email already exists." }, { status: 400 });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save User to Database
        const newUser = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        };

        await db.collection("users").insertOne(newUser);

        return NextResponse.json({ message: "User registered successfully!", redirect: '/dashboard' }, { status: 201 });
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
