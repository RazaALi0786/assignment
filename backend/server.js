const express = require("express");
const cors = require("cors");
require("dotenv").config();

const customersRouter = require("./routes/customers");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/customers", customersRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`THINK41 API running on http://localhost:${PORT}`);
});
