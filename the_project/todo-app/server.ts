import { createServer, IncomingMessage, ServerResponse } from "http";

const PORT = process.env.PORT ?? "3000";

// The handler takes explicitly typed request and response objects
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  // Set the response headers
  res.writeHead(200, { "Content-Type": "application/json" });

  // Send a JSON response body
  const responseData = {
    message: "Hello World from TypeScript!",
    status: "success",
    timestamp: new Date().toISOString(),
  };

  res.end(JSON.stringify(responseData));
});

// Start listening for incoming network requests
server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
