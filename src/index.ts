import sensorHelper from "./components/sensor/sensor.helper";

const express = require("express");

const app = express();

const PORT = 3333;
console.log("sadas")

app.listen(PORT, () => {
    console.log('Server is running on ' + PORT)
});