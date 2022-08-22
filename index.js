const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const canciones = require("./canciones");


app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(3000, () => console.log("App escuchando en el puerto 3000!"));


app.use("/", canciones);

app.use(function (req, res, next) {
  res.status(404).send("No se encontro nada.");
});



