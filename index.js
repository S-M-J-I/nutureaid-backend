require("dotenv").config({ path: `${__dirname}/env.env` });
require("./src/db/mongoose");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const body_parser = require("body-parser");

const app = express();

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));

const user_routes = require("./src/routes/userRoutes");
const appointment_routes = require("./src/routes/appointmentRoutes");
const circle_routes = require("./src/routes/circleRoutes");
const medicine_routes = require("./src/routes/medicineTaskRoutes");
const report_routes = require("./src/routes/reportRoutes");

// * AUTH SERVICE ROUTES

app.use("/api/auth/user/", user_routes);
app.use("/api/auth/appointment/", appointment_routes);
app.use("/api/auth/circle/", circle_routes);
app.use("/api/auth/medicine_tasks/", medicine_routes);
app.use("/api/auth/reports/", report_routes);

app.use("*", (req, res, next) => {
  res.status(404).send({ message: "Resource Not Found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server is up!", process.env.PORT);
});
