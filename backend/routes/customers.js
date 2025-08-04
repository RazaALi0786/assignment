const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ List all customers (with optional pagination)
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const result = await db.query(
      "SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching customers",
      error: err.message,
    });
  }
});

// ✅ Get specific customer + order count
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid customer ID" });
  }

  try {
    const customerResult = await db.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);

    if (customerResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    const orderCountResult = await db.query(
      "SELECT COUNT(*) FROM orders WHERE user_id = $1",
      [id]
    );

    const customer = customerResult.rows[0];
    const orderCount = parseInt(orderCountResult.rows[0].count);

    res.json({
      success: true,
      data: {
        ...customer,
        order_count: orderCount,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching customer",
      error: err.message,
    });
  }
});

module.exports = router;
