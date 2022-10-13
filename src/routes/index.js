const routes = require("express").Router();

routes.get('/test', (req, res) => {
    res.status(200).send("Test")
})