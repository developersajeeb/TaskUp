import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Post the category
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

// Get the user specific category
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

        // Sort categories in reverse order
        const sortedCategories = userCategories?.categories?.slice().reverse() || [];

        return NextResponse.json({ success: true, data: sortedCategories }, { status: 200 });

    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

// Delete single Category
export async function DELETE(req: NextResponse) {
    try {
        const client = await clientPromise;
        const db = client.db("taskManagement");

        const categoriesCollection = db.collection('categories');
        const tasksCollection = db.collection('tasks');

        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get('email');
        const index = parseInt(searchParams.get('index') || '-1');

        if (!userEmail || index < 0) {
            return NextResponse.json({ success: false, message: 'User email and valid index are required' }, { status: 400 });
        }

        // Find user categories
        const user = await categoriesCollection.findOne({ userEmail });
        if (!user || !user.categories) {
            return NextResponse.json({ success: false, message: 'Categories not found' }, { status: 404 });
        }

        // Get the category name to delete
        const categoryToDelete = user.categories[index];
        if (!categoryToDelete) {
            return NextResponse.json({ success: false, message: 'Invalid category index' }, { status: 400 });
        }

        // Check if the category exists in any other task
        const matchingTasks = await tasksCollection.find({
            userEmail,
            taskCategory: categoryToDelete,
        }).toArray();

        if (matchingTasks.length > 0) {
            // If category exists in tasks, remove it from all tasks
            await tasksCollection.updateMany(
                { userEmail },
                { $pull: { taskCategory: categoryToDelete } }
            );
        }

        // Remove the category from categories collection
        const updatedCategories = user.categories.filter((_: any, i: number) => i !== index);
        await categoriesCollection.updateOne(
            { userEmail },
            { $set: { categories: updatedCategories } }
        );

        return NextResponse.json({ success: true, message: 'Category deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}