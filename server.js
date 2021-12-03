const express = require("express");
require("dotenv").config({ path: "./config.env" });
const app = express();
const cors = require("cors");
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

const PORT = process.env.PORT;

const server = app.listen(PORT, () =>
  console.log(`server running on port: ${PORT}`)
);

app.use("/", require("./routes/spotify.route"));
