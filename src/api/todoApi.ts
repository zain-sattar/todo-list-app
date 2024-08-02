import axios from "axios";

import { TaskType } from "../store/todoController";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const todoApi = axios.create({
  baseURL: `${BASE_URL}/todos`,
});

const getTodos = async () => {
  const response = await todoApi.get("/");
  return response.data;
};

const addTodo = async (todo: TaskType) => {
  const response = await todoApi.post("/", todo);
  return response.data;
};

const deleteTodo = async (id: string) => {
  const response = await todoApi.delete(`/${id}`);
  return response.data;
};

const editTodo = async (todo: TaskType) => {
  const { _id, ...rest } = todo;
  const response = await todoApi.put(`/${_id}`, rest);
  return response.data;
};

export { getTodos, addTodo, deleteTodo, editTodo };
