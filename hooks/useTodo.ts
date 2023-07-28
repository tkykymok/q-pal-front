import useSWR from 'swr';
import {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import useWebSocket from 'react-use-websocket';
import { ITodoUsecase } from '@/core/usecases/TodoUsecase';
import container from '@/config/di';
import { Todo } from '@/types/models/Todo';
import { FieldValues, useForm } from 'react-hook-form';
import { UseFormRegister } from 'react-hook-form/dist/types/form';

const todoUsecase = container.get<ITodoUsecase>('ITodoUsecase');

const fetchAllTodos = async () => {
  const res = await todoUsecase.getAllTodos();
  return res.todos;
};

export interface UseTodoReturn {
  register: UseFormRegister<FieldValues>;
  isTyping: boolean;
  todos: Todo[] | undefined;
  error: any;
  wsTodo: any;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleAddTodo: () => Promise<void>;
}

export const useTodo = (): UseTodoReturn => {
  const { register, handleSubmit, setValue, getValues } = useForm<FieldValues>({
    defaultValues: {
      input: 'aaa',
    },
  });
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<number | undefined>();

  const { data: todos, error, mutate } = useSWR<Todo[]>('todos', fetchAllTodos);

  const userId = useMemo(() => {
    return Math.floor(Math.random() * 11);
  }, [])

  const wsTodo = useWebSocket(
    process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL + `/todo?userId=1`
  );
  const wsTodoInput = useWebSocket(
    process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL + `/todo/input?userId=1`
  );

  useEffect(() => {
    if (wsTodo.lastMessage?.data) {
      const newTodo: Todo = JSON.parse(wsTodo.lastMessage?.data);
      mutate((prev) => (prev ? [...prev, newTodo] : [newTodo]), false).then(
        (r) => {}
      );
    }
  }, [wsTodo.lastMessage, mutate]);

  useEffect(() => {
    if (wsTodoInput.lastMessage?.data) {
      const message = JSON.parse(wsTodoInput.lastMessage?.data);
      setIsTyping(message.is_typing);
    }
  }, [wsTodoInput.lastMessage]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue('input', event.target.value);

      clearTimeout(typingTimeoutRef.current);

      wsTodoInput.sendMessage(
        JSON.stringify({
          type: 'on input',
          data: {
            type: 'on input',
            is_typing: !!event.target.value,
          },
        })
      );

      typingTimeoutRef.current = window.setTimeout(() => {
        wsTodoInput.sendMessage(
          JSON.stringify({
            type: 'on input',
            data: {
              type: 'on input',
              is_typing: false,
            },
          })
        );
      }, 1000);
    },
    [wsTodoInput, setValue]
  );

  const handleAddTodo = handleSubmit(async (data) => {
    const newTodo = { title: data.input };
    await todoUsecase.addTodo(newTodo);
    setValue('input', '');
  });

  return {
    register,
    isTyping,
    todos,
    error,
    wsTodo,
    handleInputChange,
    handleAddTodo,
  };
};
