import Koa from "koa";

const app = new Koa();
const PORT = process.env.PORT || 3000;

const increment = (count) => count + 1;
let value = 0;

app.use(async (ctx) => {
  ctx.body = `pong ${value}`;
  value = increment(value);
});

console.log(`Listening on port ${PORT}`);
app.listen(PORT);
