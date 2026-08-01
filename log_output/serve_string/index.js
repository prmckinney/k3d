import Koa from "koa";
import fs from "fs";

const app = new Koa();
const PORT = process.env.PORT || 3000;

const filePath = "/usr/src/app/files/uuid.txt";

const getFile = async () =>
  new Promise((res) => {
    fs.readFile(filePath, (err, buffer) => {
      if (err)
        return console.log("FAILED TO READ FILE", "----------------", err);
      res(buffer);
    });
  });

app.use(async (ctx) => {
  const uuid = await getFile();
  ctx.body = `${uuid}`;

  console.log(`${uuid}`);
});

console.log(`Started on port ${PORT}`);
app.listen(PORT);
