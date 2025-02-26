const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const { protect } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Customer feedback routes
 */

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Submit customer feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               suggestions:
 *                 type: string
 *                 description: Optional suggestions
 *               rating:
 *                 type: string
 *                 enum: [Excellent, Wonderful, Problematic, Unable to use]
 *     responses:
 *       201:
 *         description: Feedback submitted successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Server error.
 */
router.post("/", protect, async (req, res) => {
  const { suggestions, rating } = req.body;

  if (!rating) {
    return res.status(400).json({ message: "Rating is required." });
  }

  // Validate rating value
  const validRatings = ["Excellent", "Wonderful", "Problematic", "Unable to use"];
  if (!validRatings.includes(rating)) {
    return res.status(400).json({ message: "Invalid rating value." });
  }

  try {
    const feedback = new Feedback({
      customerID: req.user.customerID, // ✅ Fetch from auth, not frontend
      suggestions,
      rating,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
