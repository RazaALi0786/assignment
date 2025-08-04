const express = require("express");
const cors = require("cors");
require("dotenv").config();

const customersRouter = require("./routes/customers");
const ordersRouter = require("./routes/orders");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/customers", customersRouter);
app.use("/api/orders", ordersRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`THINK41 API running on http://localhost:${PORT}`);
});
