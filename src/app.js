const express = require("express");
const test = require("./router/test");

const app = express();

//app.use(express.json());
app.use(test);

module.exports = app;
