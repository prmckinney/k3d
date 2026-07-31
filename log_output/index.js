import { v4 as uuidv4 } from "uuid";

const uuid = uuidv4();

const logUUID = () => {
  const time = new Date();

  console.log(`${time}: ${uuid}`);

  setTimeout(logUUID, 5000);
};

logUUID();
