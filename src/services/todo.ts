const TODO_URL = '/api/todo';

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