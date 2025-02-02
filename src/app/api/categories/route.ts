import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("taskManagement");
        const categoriesCollection = db.collection('categories');

        const body = await req.json();
        const { categoryName } = body;

        if (!categoryName || typeof categoryName !== 'string') {
            return NextResponse.json({ message: 'Invalid category name' }, { status: 400 });
        }

        await categoriesCollection.insertOne({ categoryName });

        return NextResponse.json({ message: 'Category added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
