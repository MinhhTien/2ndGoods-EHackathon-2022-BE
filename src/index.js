const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const config = require("./config")
const port = process.env.PORT || "3000";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(config.APPLICATION_PORT, () => {
    console.log(`2ndGoods app listening on port ${port}!`)
})

module.exports = app;