const BASE_URL = '/api/tasks';
const TODO_URL = '/api/todo';

// Fetch user specific all tasks
export const fetchTasks = async (userEmail: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${BASE_URL}?userEmail=${encodeURIComponent(userEmail)}`);
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${BASE_URL}/completed?userEmail=${encodeURIComponent(userEmail)}`);

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${BASE_URL}/incomplete?userEmail=${encodeURIComponent(userEmail)}`);

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${BASE_URL}/${taskId}`, {
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${BASE_URL}/${taskId}`);
        if (!res.ok) throw new Error('Failed to fetch task details');
        const data = await res.json();
        return data?.data;
    } catch (error) {
        console.error("Error fetching task details:", error);
        throw error;
    }
};

// Add a new todo
export const addTodo = async (taskId: string, todoName: string) => {
    try {
        const newTodo = { workDone: false, todoName };
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${TODO_URL}/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ todoList: [newTodo] }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to add todo');
        return result;
    } catch (error) {
        console.error('Error adding todo:', error);
        throw error;
    }
};

// Update todo status
export const updateTodoStatus = async (taskId: string, index: number, workDone: boolean) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${TODO_URL}/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updateWorkDone: { todoIndex: index, workDone } }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to update todo status');
        return result;
    } catch (error) {
        console.error('Error updating todo status:', error);
        throw error;
    }
};

// Delete a todo
export const deleteTodo = async (taskId: string, index: number) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${TODO_URL}/${taskId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ todoIndex: index }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to delete todo');
        return result;
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};
