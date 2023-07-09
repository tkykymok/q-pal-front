'use client';

import 'reflect-metadata';
import React from 'react';
import {useTodo} from '@/hooks/useTodo';
import {ReadyState} from 'react-use-websocket';
import Board from '@/app/board/page';

const Todo = () => {
  const {
    register,
    isTyping,
    todos,
    error,
    wsTodo,
    handleInputChange,
    handleAddTodo,
  } = useTodo();

  if (error) return <div>Failed to load todos</div>;
  if (!todos) return <div>Loading...</div>;

  return (
    <main>
      <div className="flex flex-col space-y-3 bg-white p-5">
        <h1>Todo List</h1>
        <ul>
          {todos &&
            todos.map((todo) => (
              <li key={todo.id}>
                {todo.title}
                {todo.completed ? ' (completed)' : ''}
              </li>
            ))}
        </ul>

        <div className="flex space-x-2">
          <input
            className="border border-neutral-100 rounded-md bg-amber-50 p-1"
            type="text"
            {...register('input')}
            onChange={handleInputChange}
          />
          <button
            className="p-1 bg-blue-300 rounded-md"
            onClick={handleAddTodo}
          >
            Add Todo
          </button>
        </div>
        {isTyping && <div className="typing-indicator">Someone is typing</div>}
        <div>
          WebSocket status:{' '}
          {wsTodo.readyState === ReadyState.OPEN ? 'open' : 'closed'}
        </div>
      </div>
    </main>
  );
}
export default Todo;
