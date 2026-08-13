import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import route from "koa-route";
import { pipeline } from "node:stream/promises";
import { Pool } from "pg";
import path from "path";
import fs from "fs";
import { access, stat, mkdir, unlink } from "fs/promises";
import axios from "axios";

let broken = false;

const app = new Koa();
const PORT = process.env.PORT ?? "3000";

const postgres = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "password",
  database: process.env.POSTGRES_DB || "postgres",
});

const directory = process.env.DIR ?? path.join(".");
const imagePath = path.join(directory, "image.jpg");

const fileExists = async (path: string) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const fileOld = async (file: string) => {
  try {
    const oldAge = Date.now() - 10 * 60 * 1000; // Time for 10 minutes ago
    const stats = await stat(file);
    if (stats.mtime.getTime() < oldAge) return true;
    else return false;
  } catch (error) {
    console.log(`Error: ${error}`);
    return true;
  }
};

const getFile = async (filePath: string) =>
  new Promise((res) => {
    fs.readFile(filePath, (err, buffer) => {
      if (err)
        return console.log("FAILED TO READ FILE", "----------------", err);
      res(buffer);
    });
  });

const refreshImage = async () => {
  // Create directory if it doesn't exist
  if (!(await fileExists(directory))) await mkdir(directory);

  // Check if the file exists and is older than 10 minutes
  if (await fileOld(imagePath)) {
    // Remove old file
    if (await fileExists(imagePath)) await unlink(imagePath);
    // Download new file
    const response = await axios.get("https://picsum.photos/1200", {
      responseType: "stream",
    });
    const writeStream = fs.createWriteStream(imagePath);
    await pipeline(response.data, writeStream);
  }
};

const serveImage = async (ctx: Koa.Context) => {
  await refreshImage();

  ctx.body = await getFile(imagePath);
  ctx.set("Content-disposition", "attachment; filename=image.jpg");
  ctx.set("Content-type", "image/jpeg");
  ctx.status = 200;
};

const readTodo = async () => {
  const result = await postgres.query("SELECT todo FROM todos;");
  console.log(
    "Read todos ==> ",
    result.rows.map((todo) => todo.todo),
  );
  return result.rows.map((todo) => todo.todo);
};

//CREATE TABLE todos(todo TEXT);

const serveTodo = async (ctx: Koa.Context) => {
  ctx.body = await readTodo();
};

const addTodo = async (ctx: Koa.Context) => {
  const postString: any = ctx.request.body;

  if (postString.todo) {
    console.log("Add todo ==> ", postString.todo);
    if (postString.todo.length > 140) {
      console.log("ERROR: todo is too long");
      ctx.status = 400;
      return;
    }

    ctx.body = `Received string: ${postString.todo}`;
    ctx.status = 200;

    const data = await readTodo();
    data.push(postString.todo);
    await postgres.query("INSERT INTO todos VALUES ($1);", [postString.todo]);
  } else ctx.status = 400;
};

const breakBE = (ctx: Koa.Context) => {
  broken = true;
  ctx.status = 200;
};

const livez = (ctx: Koa.Context) => {
  if (!broken) ctx.status = 200;
  else ctx.status = 500;
};

const readyz = async (ctx: Koa.Context) => {
  if (!broken) {
    try {
      await postgres.query("SELECT NOW()");
      ctx.status = 200;
    } catch (err) {
      console.log("Failed to connect to POSTGRES: ", process.env.POSTGRES_HOST);
      ctx.status = 503;
    }
  } else {
    ctx.status = 500;
  }
};

app.use(cors());
app.use(bodyParser());
app.use(route.get("/image", serveImage));
app.use(route.get("/todo", serveTodo));
app.use(route.post("/todo", addTodo));
app.use(route.post("/break", breakBE));
app.use(route.get("/livez", livez));
app.use(route.get("/readyz", readyz));

console.log(`Started on port ${PORT}`);
app.listen(PORT);
