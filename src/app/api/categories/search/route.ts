import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("taskManagement");
        const categoriesCollection = db.collection('categories');

        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get('email');
        const query = searchParams.get('query')?.toLowerCase() || '';

        if (!userEmail) {
            return NextResponse.json({ success: false, message: 'User email is required' }, { status: 400 });
        }

        const userCategories = await categoriesCollection.findOne({ userEmail });

        if (!userCategories?.categories?.length) {
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        const filteredCategories = userCategories.categories
            .filter((category: string) => category.toLowerCase().includes(query))
            .reverse();

        return NextResponse.json({ success: true, data: filteredCategories }, { status: 200 });

    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}