import {
  Box,
  Button,
  Divider,
  Container,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState, SyntheticEvent } from "react";
import axios from "axios";

const App = () => {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<string[]>("http://localhost:3000/todo");
      setTodos(data);
    };
    fetchData();
  }, []);

  const addTodo = (event: SyntheticEvent) => {
    event.preventDefault();
    axios.post("http://localhost:3000/todo", { todo: newTodo });
    setTodos((todos) => [...todos, newTodo]);
  };

  return (
    <div className="App">
      <Container>
        <Typography variant="h3" sx={{ marginBottom: "0.5em" }}>
          Todo App
        </Typography>
        <Box
          component="img"
          sx={{
            height: 200,
            width: 300,
            objectFit: "cover",
          }}
          alt="Description of image"
          src="http://127.0.0.1:3000/image"
        />
        <Divider sx={{ marginY: 2 }} />
        <form onSubmit={addTodo}>
          <Stack direction="row">
            <TextField
              label="Enter a new todo (max 140 characters)"
              sx={{ flexGrow: 1 }}
              slotProps={{ htmlInput: { maxLength: 140 } }}
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <Button type="submit">Send</Button>
          </Stack>
        </form>
        <Typography variant="h4" sx={{ marginBottom: "0.5em" }}>
          Todos
        </Typography>
        <List>
          {todos.map((todo, index) => (
            <ListItem key={index}>{todo}</ListItem>
          ))}
        </List>
      </Container>
    </div>
  );
};

export default App;
