const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Optional: Get all orders (for admin or testing)
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC LIMIT 50"
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: err.message,
    });
  }
});

// ✅ Get all orders for a specific customer
router.get("/customer/:customerId", async (req, res) => {
  const { customerId } = req.params;

  if (!/^\d+$/.test(customerId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid customer ID",
    });
  }

  try {
    const customerExists = await db.query(
      "SELECT id FROM users WHERE id = $1",
      [customerId]
    );
    if (customerExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const result = await db.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [customerId]
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching customer orders",
      error: err.message,
    });
  }
});

// ✅ Get specific order by order ID
router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  if (!/^\d+$/.test(orderId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  try {
    const result = await db.query("SELECT * FROM orders WHERE order_id = $1", [
      orderId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: err.message,
    });
  }
});

module.exports = router;
