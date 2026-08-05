import Koa from "koa";
import route from "koa-route";
import { pipeline } from "node:stream/promises";
import path from "path";
import fs from "fs";
import { access, stat, mkdir, unlink } from "fs/promises";
import axios from "axios";

const app = new Koa();
const PORT = process.env.PORT ?? "3000";

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

const serveImage = async (ctx) => {
  await refreshImage();

  ctx.body = await getFile(imagePath);
  ctx.set("Content-disposition", "attachment; filename=image.jpg");
  ctx.set("Content-type", "image/jpeg");
  ctx.status = 200;
};

app.use(route.get("/image", serveImage));

console.log(`Started on port ${PORT}`);
app.listen(PORT);
