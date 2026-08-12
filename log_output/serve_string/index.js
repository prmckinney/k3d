import Koa from "koa";
import route from "koa-route";
import fs from "fs";
import path from "path";
import axios from "axios";

const app = new Koa();
const PORT = process.env.PORT || 3000;

const directory = "/usr/src/app/files";
const uuidFilePath = path.join(directory, "uuid.txt");
const configPath = "/config/information.txt";

const getFile = async (filePath) =>
  new Promise((res) => {
    fs.readFile(filePath, (err, buffer) => {
      if (err)
        return console.log("FAILED TO READ FILE", "----------------", err);
      res(buffer);
    });
  });

const livez = async (ctx) => {
  ctx.status = 200;
};

const readyz = async (ctx) => {
  try {
    await axios.get("http://ping-pong-svc:1235/pings");
    ctx.status = 200;
  } catch (err) {
    console.log("Failed to connect to ping pong");
    ctx.status = 503;
  }
};

const log = async (ctx) => {
  const uuid = await getFile(uuidFilePath);
  const response = await axios.get("http://ping-pong-svc:1235/pings");
  const pingpong = response.data;
  const config = await getFile(configPath);
  const message = process.env.MESSAGE;
  ctx.body = `file content: ${config}\n`;
  ctx.body += `env variable: MESSAGE=${message}\n`;
  ctx.body += `${uuid}\n`;
  ctx.body += `Ping \/ Pongs: ${pingpong}\n`;

  console.log(`${uuid}\nPing \/ Pongs: ${pingpong}`);
};

app.use(route.get("/", log));
app.use(route.get("/livez", livez));
app.use(route.get("/readyz", readyz));

console.log(`Started on port ${PORT}`);
app.listen(PORT);
