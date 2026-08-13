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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const App = () => {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState<string[]>([]);
  const [broken, setBroken] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<string[]>("/todo");
      setTodos(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      while (broken) {
        try {
          const response = await axios.get<string[]>("/readyz");
          if (response.status === 200) {
            setBroken(false);
          } else {
            setBroken(true);
          }
        } catch {
          setBroken(true);
          await delay(5000);
        }
      }
    };
    fetchStatus();
  }, [broken]);

  const addTodo = (event: SyntheticEvent) => {
    event.preventDefault();
    axios.post("/todo", { todo: newTodo });
    setTodos((todos) => [...todos, newTodo]);
  };

  return (
    <div className="App">
      {broken && (
        <Container>
          <Typography variant="h3" sx={{ marginBottom: "0.5em" }}>
            System Failure
          </Typography>
          <Typography variant="h5" sx={{ marginBottom: "0.5em" }}>
            Backend isn't currently responding
          </Typography>
        </Container>
      )}
      {!broken && (
        <Container>
          {" "}
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
            src="/image"
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
          <Button
            onClick={() => {
              axios.post("/break");
              setBroken(true);
            }}
          >
            Break
          </Button>
        </Container>
      )}
    </div>
  );
};

export default App;
