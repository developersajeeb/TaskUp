const TASK_URL = '/api/tasks';
const CATEGORY_URL = '/api/categories';

// Fetch user specific all tasks
export const fetchTasks = async (userEmail: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${TASK_URL}?userEmail=${encodeURIComponent(userEmail)}`);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const {data} = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
};

// Fetch user specific all Complete tasks
export const getCompletedTasks = async (userEmail: string | null) => {
    if (!userEmail) return [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${TASK_URL}/completed?userEmail=${encodeURIComponent(userEmail)}`);

        if (!res.ok) throw new Error("Failed to load completed tasks");

        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching completed tasks:", error);
        return [];
    }
};

// Fetch user specific all incomplete tasks
export const getIncompleteTasks = async (userEmail: string | null) => {
    if (!userEmail) return [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${TASK_URL}/incomplete?userEmail=${encodeURIComponent(userEmail)}`);

        if (!res.ok) throw new Error("Failed to load incomplete tasks");

        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching incomplete tasks:", error);
        return [];
    }
};

// Delete task
export const deleteTask = async (taskId: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${TASK_URL}/${taskId}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to delete task');
        return { ok: res.ok, message: data.message };
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}

// Fetch task details
export const fetchTaskDetails = async (taskId: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${TASK_URL}/${taskId}`);
        if (!res.ok) throw new Error('Failed to fetch task details');
        const {data} = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching task details:", error);
        throw error;
    }
};

// Get user specific categories
export const fetchCategories = async (userEmail: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${CATEGORY_URL}?email=${encodeURIComponent(userEmail)}`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

// Create a new category
export const createCategory = async (categoryName: string, userEmail: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${CATEGORY_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryName: categoryName.trim(), userEmail }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to create category');
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};