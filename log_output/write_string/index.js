import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const uuid = uuidv4();
const directory = "/usr/src/app/files";
const filePath = path.join(directory, "uuid.txt");

const fileAlreadyExists = async () =>
  new Promise((res) => {
    fs.stat(filePath, (err, stats) => {
      if (err || !stats) return res(false);
      return res(true);
    });
  });

const logUUID = async () => {
  const time = new Date();

  console.log(`${time}: ${uuid}`);

  // Delete file if it already exists
  if (await fileAlreadyExists())
    new Promise((res) => fs.unlink(filePath, (err) => res()));

  await new Promise((res) => fs.mkdir(directory, (err) => res()));
  await new Promise((res) =>
    fs.appendFile(filePath, `${time}: ${uuid}`, (err) => res()),
  );

  setTimeout(logUUID, 5000);
};

logUUID();
