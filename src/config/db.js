import mongoose from "mongoose";

import config from "./index.js";

let URL = ``;
let URL_QUERY = ``;

if (config.type == "test") {
  URL = config.devDbConnectionUrl;
  URL_QUERY = config.devDbConnectionUrlQuery;
} else {
  URL = config.prodDbConnectionUrl;
  URL_QUERY = config.prodDbConnectionUrlQuery;
}

URL = URL.replace("<username>", config.databaseUsername);
URL = URL.replace("<password>", config.databasePassword);
URL = `${URL}/${config.databaseName}?${URL_QUERY}`;

const connectDB = async () => {
  // try {
  await mongoose.connect(URL, {});
  // useNewUrlParser: true, // provides better support for connection strings using newer MongoDB features.
  // useUnifiedTopology: true, // provides a more robust and flexible way of managing connections to the MongoDB server

  console.log("Database connection was successfully established");
  // } catch (error) {
  // console.error("Error connecting to Database:", error.message);

  // process.exit(1); // Exit process with failure
  // }
};

export default { connectDB };
