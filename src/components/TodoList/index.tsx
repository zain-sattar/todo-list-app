import { CardContent, Box, Typography, IconButton } from "@mui/material";
import { Edit, Delete, Done } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "react-query";

import style from "./styles";
import { getTodos, deleteTodo, editTodo } from "../../api/todoApi";
import { TaskType, todoStateController, useTodoState } from "../../store/todoController";

function TodoList() {
  const todoState = useTodoState();
  const queryClient = useQueryClient();

  const { status } = useQuery("todos", getTodos, {
    onSuccess: (data) => {
      todoStateController.setTodoList(data);
    },
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const editTodoMutation = useMutation(editTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const toggleCompletionHandler = async (todo: TaskType) => {
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    editTodoMutation.mutate(updatedTodo);
  };

  const editHandler = async (todo: TaskType) => {
    todoStateController.setSelectedTodo(todo);
  };

  const deleteHandler = async (id: string = "") => {
    deleteTodoMutation.mutate(id);
  };

  if (status === "loading")
    return (
      <Typography variant="h4" sx={style.todoTaskStyle}>
        Loading...
      </Typography>
    );
  if (status === "error")
    return (
      <Typography variant="h4" sx={style.todoTaskStyle}>
        Error!
      </Typography>
    );

  const todos = todoState.todoList.get()
  return (
    <CardContent sx={style.body}>
      {todos?.map((todo: TaskType) => (
        <Box key={todo._id} sx={style.todoTaskBoxStyle}>
          <Typography
            variant="h6"
            sx={{
              ...style.todoTaskStyle,
              ...(todo.isCompleted && style.completedTaskStyle),
            }}
          >
            {todo.task}
          </Typography>
          <IconButton
            aria-label="done"
            onClick={() => {
              toggleCompletionHandler(todo);
            }}
          >
            <Done sx={{ color: "white" }} />
          </IconButton>
          <IconButton
            aria-label="edit"
            onClick={() => {
              editHandler(todo);
            }}
          >
            <Edit sx={{ color: "white" }} />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => {
              deleteHandler(todo._id);
            }}
          >
            <Delete sx={{ color: "white" }} />
          </IconButton>
        </Box>
      ))}
    </CardContent>
  );
}

export default TodoList;
