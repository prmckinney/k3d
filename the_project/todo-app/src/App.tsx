//import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
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

const App = () => {
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
        <Stack direction="row">
          <TextField
            label="Enter a new todo (max 140 characters)"
            sx={{ flexGrow: 1 }}
            slotProps={{ htmlInput: { maxLength: 140 } }}
          />
          <Button>Send</Button>
        </Stack>
        <Typography variant="h4" sx={{ marginBottom: "0.5em" }}>
          Todos
        </Typography>
        <List>
          <ListItem>Task 1</ListItem>
          <ListItem>Task 2</ListItem>
          <ListItem>Task 3</ListItem>
        </List>
      </Container>
    </div>
  );
};

export default App;
