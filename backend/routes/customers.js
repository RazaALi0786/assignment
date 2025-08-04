const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ List all customers (with optional pagination)
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const result = await db.query(
      `
      SELECT u.*, COUNT(o.order_id) AS order_count
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY u.id
      LIMIT $1 OFFSET $2
      `,
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

router.get("/top", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.id, u.first_name, u.last_name, COUNT(o.order_id) AS order_count
      FROM users u
      JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY order_count DESC
      LIMIT 10
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching top customers",
      error: err.message,
    });
  }
});

router.get("/:id/summary", async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await db.query("SELECT * FROM users WHERE id = $1", [id]);

    if (customer.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    const orders = await db.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [id]
    );

    res.json({
      success: true,
      data: {
        ...customer.rows[0],
        orders: orders.rows,
        order_count: orders.rows.length,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching customer summary",
      error: err.message,
    });
  }
});

module.exports = router;
