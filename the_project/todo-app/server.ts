import { createServer, IncomingMessage, ServerResponse } from "http";
import path from "path";
import fs from "fs";
import { access, stat, mkdir, unlink } from "fs/promises";
import axios from "axios";

const PORT = process.env.PORT ?? "3000";

const directory = path.join("/", "usr", "src", "app", "files");
const filePath = path.join(directory, "image.jpg");

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
    console.log(error);
    return true;
  }
};

const refreshImage = async () => {
  // Create directory if it doesn't exist
  if (!(await fileExists(directory))) await mkdir(directory);

  // Check if the file exists and is older than 10 minutes
  if (await fileOld(filePath)) {
    // Remove old file
    if (await fileExists(filePath)) await unlink(filePath);
    // Download new file
    const response = await axios.get("https://picsum.photos/1200", {
      responseType: "stream",
    });
    response.data.pipe(fs.createWriteStream(filePath));
  }
};

// The handler takes explicitly typed request and response objects
const server = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === "/") {
      // Set the response headers
      await refreshImage();
      res.statusCode = 200;
      res.write("<html>");
      res.write("<h1>");
      res.write("Todo App");
      res.write("</h1>");
      res.write('<img src="\image" align="middle">');
      res.end("</html>");
    } else if (req.url === "/image") {
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      fs.createReadStream(filePath).pipe(res);
    }
  },
);

// Start listening for incoming network requests
server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
