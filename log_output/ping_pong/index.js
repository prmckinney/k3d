import Koa from "koa";
import route from "koa-route";
import { Pool } from "pg";

const app = new Koa();
const PORT = process.env.PORT || 3000;

const postgres = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "password",
  database: process.env.POSTGRES_DB || "postgres",
});

let value = 0;

const getPing = async () => {
  const result = await postgres.query("SELECT ping FROM pingpong;");
  return result.rows[0].ping;
};

const writePing = async (ping) => {
  const result = await postgres.query("UPDATE pingpong SET ping = ($1);", [
    ping,
  ]);
};

const pingpong = async (ctx) => {
  const result = (await getPing()) + 1;
  await writePing(result);
  ctx.body = `pong ${result}`;
};

const pings = async (ctx) => {
  const result = await getPing();
  ctx.body = `${result}`;
};

const livez = async (ctx) => {
  ctx.status = 200;
};

const readyz = async (ctx) => {
  try {
    await postgres.query("SELECT NOW()");
    ctx.status = 200;
  } catch (err) {
    console.log("Failed to connect to POSTGRES: ", process.env.POSTGRES_HOST);
    ctx.status = 503;
  }
};

app.use(route.get("/", pingpong));
app.use(route.get("/pings", pings));
app.use(route.get("/livez", livez));
app.use(route.get("/readyz", readyz));

console.log(`Listening on port ${PORT}`);
app.listen(PORT);
