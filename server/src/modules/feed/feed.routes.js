const express = require('express');
const { getFeed, getRecentReports, createFeedItem } = require('./feed.controller');
const { validateFeedItem } = require('./feed.validation');

const router = express.Router();

router.get("/", getFeed);
router.get("/recent-reports", getRecentReports);
router.post("/", requireFeedAdminKey, validateFeedItem, createFeedItem);

function requireFeedAdminKey(req, res, next) {
  const configuredKey = process.env.FEED_ADMIN_KEY;
  const providedKey = req.get("x-feed-admin-key");

  if (!configuredKey) {
    return res.status(503).json({ error: "Feed publishing is not configured" });
  }
  if (!providedKey || providedKey !== configuredKey) {
    return res.status(401).json({ error: "Invalid or missing feed admin key" });
  }
  return next();
}

module.exports = router;
