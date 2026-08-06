import Koa from "koa";
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

app.use(async (ctx) => {
  const uuid = await getFile(uuidFilePath);
  const response = await axios.get("http://ping-pong-svc:1235/pings");
  const pingpong = response.data;
  const config = await getFile(configPath);
  const message = process.env.MESSAGE;
  ctx.body = `file content: ${config}`;
  ctx.body += `env variable: MESSAGE=${message}`;
  ctx.body += `${uuid}`;
  ctx.body += `Ping \/ Pongs: ${pingpong}`;

  console.log(`${uuid}\nPing \/ Pongs: ${pingpong}`);
});

console.log(`Started on port ${PORT}`);
app.listen(PORT);
