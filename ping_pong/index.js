import Koa from "koa";
import fs from "fs";
import path from "path";

const app = new Koa();
const PORT = process.env.PORT || 3000;

const directory = "/usr/src/app/files";
const filePath = path.join(directory, "pingpong.txt");

let value = 0;

const fileAlreadyExists = async () =>
  new Promise((res) => {
    fs.stat(filePath, (err, stats) => {
      if (err || !stats) return res(false);
      return res(true);
    });
  });

const getFile = async () =>
  new Promise((res) => {
    fs.readFile(filePath, (err, buffer) => {
      if (err)
        return console.log("FAILED TO READ FILE", "----------------", err);
      res(buffer);
    });
  });

app.use(async (ctx) => {
  // Delete file if it already exists
  if (await fileAlreadyExists()) {
    value = parseInt(await getFile()) + 1;
    new Promise((res) => fs.unlink(filePath, (err) => res()));
  }

  await new Promise((res) => fs.mkdir(directory, (err) => res()));
  await new Promise((res) =>
    fs.appendFile(filePath, `${value}`, (err) => res()),
  );

  ctx.body = `pong ${value}`;
});

console.log(`Listening on port ${PORT}`);
app.listen(PORT);
