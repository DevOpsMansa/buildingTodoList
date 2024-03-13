//importations
import React, { useState, useEffect } from 'react';
import "./index.css";
import TodoData from './Components/TodoData';

const TodoList = () => {
  // State variables using the useState hook
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodo, setEditedTodo] = useState('');

  // Function to add a new todo to the list
  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newTodos = [{ id: Date.now(), text: newTodo, complete: false }, ...todos];
      setTodos(newTodos);
      setNewTodo('');
    }
  };

  // Function to delete a todo from the list
  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  // Function to toggle the completion status of a todo
  const toggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, complete: !todo.complete } : todo
    );
    setTodos(updatedTodos);
  };

  // Function to start editing a todo
  const startEditing = (id, text) => {
    setEditingTodoId(id);
    setEditedTodo(text);
  };

  // Function to save an edited todo
  const saveEditedTodo = () => {
    const updatedTodos = todos.map((todo) =>
      todo.id === editingTodoId ? { ...todo, text: editedTodo } : todo
    );
    setTodos(updatedTodos);
    setEditingTodoId(null);
  };

  // useEffect hook to fetch initial state data from the /todos API endpoint
  useEffect(() => {
    const fetchInitialTodos = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const initialTodos = await response.json();
        setTodos(initialTodos);
      } catch (error) {
        console.error('Error fetching initial todos:', error);
      }
    };

    fetchInitialTodos();
  }, []); // Empty dependency array ensures it runs only once on mount

  //  // useEffect hook to set the initial state from TodoData.jsx
  //  useEffect(() => {
  //   setTodos(TodoData);
  // }, []);

  return (
    <div className="todo-list-container">
      <h1>Todo List</h1>
      <input
        type="text"
        placeholder="Add a new todo"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.complete ? 'complete' : ''}>
            <input
              type="checkbox"
              checked={todo.complete}
              onChange={() => toggleComplete(todo.id)}
            />
            {editingTodoId === todo.id ? (
              <input
                type="text"
                value={editedTodo}
                onChange={(e) => setEditedTodo(e.target.value)}
              />
            ) : (
              <span>{todo.text}</span>
            )}
            <button
              onClick={() => (editingTodoId === todo.id ? saveEditedTodo() : startEditing(todo.id, todo.text))}
            >
              {editingTodoId === todo.id ? 'Save' : 'Edit'}
            </button>
            <button onClick={() => deleteTodo(todo.id)} disabled={!todo.complete}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
