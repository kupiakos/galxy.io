import * as express from "express";

const app = express();

app.set("port", process.env.PORT || 3000);
app.get("/", (req, res) => res.send("Hello, world!"));

module.exports = app;
