import http from "http";

import app from "./app.js";
import config from "./config/index.js";
import db from "./config/db.js";

// We aim to avoid using an Express server unless we are also using an Express request handler.
const server = http.createServer(app);

// const main = async () => {
//   try {
//     // Connect to your MongoDB database
//     await db.connectDB();

//     server.listen(config.port, async () => {
//       console.log(`Server is listening on PORT ${config.port}`);
//     });
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error.message);
//   }
// };

// main();

// Connect to your MongoDB database
await db
  .connectDB()
  .then(() => {
    server.listen(config.port, async () => {
      console.log(`Server is listening on PORT ${config.port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
