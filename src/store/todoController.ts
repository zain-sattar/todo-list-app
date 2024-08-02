import { hookstate, useHookstate } from "@hookstate/core";

export type TaskType = {
  task: String;
  isCompleted: boolean;
  _id?: string;
};

const initialState = {
  todoTask: undefined as TaskType | undefined,
  todoList: [] as TaskType[],
};

const todoState = hookstate(initialState);

export const useTodoState = () => useHookstate(todoState);

const todoStateControllerHandler = (state: any) => {
  return {
    setTodoList(data: TaskType[]) {
      return state.todoList.set(data);
    },
    getTodoList() {
      return state.todoList.get();
    },
    getSelectedTodo() {
      return state.todoTask.get();
    },
    setSelectedTodo(todo: TaskType | undefined) {
      if (todo) return state.todoTask.set(JSON.parse(JSON.stringify(todo)));
      else return state.todoTask.set(todo);
    },
  };
};

export const todoStateController = todoStateControllerHandler(todoState);
