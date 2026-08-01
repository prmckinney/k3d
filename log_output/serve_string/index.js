import Koa from "koa";
import fs from "fs";
import path from "path";

const app = new Koa();
const PORT = process.env.PORT || 3000;

const directory = "/usr/src/app/files";
const uuidFilePath = path.join(directory, "uuid.txt");
const ppFilePath = path.join(directory, "pingpong.txt");

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
  const pingpong = await getFile(ppFilePath);
  ctx.body = `${uuid}\nPing \/ Pongs: ${pingpong}`;

  console.log(`${uuid}\nPing \/ Pongs: ${pingpong}`);
});

console.log(`Started on port ${PORT}`);
app.listen(PORT);
