import { v4 as uuidv4 } from "uuid";
import Koa from "koa";

const uuid = uuidv4();
const app = new Koa();

const PORT = process.env.PORT || 3000;

app.use(async (ctx) => {
  const time = new Date();

  if (ctx.path.includes("favicon.ico")) return;
  console.log(`${time}: ${uuid}`);
  ctx.body = `${time}: ${uuid}`;
});

console.log(`Started with ${uuid}`);
app.listen(PORT);
