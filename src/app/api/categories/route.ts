import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("taskManagement");
        const categoriesCollection = db.collection('categories');

        const body = await req.json();
        const { categoryName, userEmail } = body;

        if (!categoryName || typeof categoryName !== 'string' || !userEmail) {
            return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
        }

        const existingUser = await categoriesCollection.findOne({ userEmail });

        if (existingUser) {
            await categoriesCollection.updateOne(
                { userEmail },
                { $addToSet: { categories: categoryName } }
            );
        } else {
            await categoriesCollection.insertOne({
                userEmail,
                categories: [categoryName],
            });
        }

        return NextResponse.json({ message: 'Category added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("taskManagement");
        const categoriesCollection = db.collection('categories');

        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get('email');

        if (!userEmail) {
            return NextResponse.json({ success: false, message: 'User email is required' }, { status: 400 });
        }

        const userCategories = await categoriesCollection.findOne({ userEmail });

        return NextResponse.json({ success: true, data: userCategories?.categories || [] }, { status: 200 });

    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}