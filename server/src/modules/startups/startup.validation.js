const allowedCauses = new Set([
  "market", "cash", "cost", "product", "compete", "timing",
  "fraud", "scale", "legal", "focus", "growth", "model",
]);

function validateStartup(req, res, next) {
  const data = req.body;

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return res.status(400).json({ error: "Request body must be a JSON object" });
  }

  const requiredText = [
    "id", "name", "what", "sector", "country", "hq",
    "closedLabel", "status", "lesson",
  ];

  const missing = requiredText.filter(
    (field) => typeof data[field] !== "string" || !data[field].trim()
  );

  if (missing.length) {
    return res.status(400).json({
      error: "Missing or invalid required text fields",
      fields: missing,
    });
  }

  if (!Number.isInteger(data.founded) || !Number.isInteger(data.closedYear)) {
    return res.status(400).json({
      error: "founded and closedYear must be whole-number years",
    });
  }

  if (!Array.isArray(data.reasons) || data.reasons.length === 0) {
    return res.status(400).json({
      error: "Provide at least one reason",
    });
  }

  const invalidReason = data.reasons.some((reason) =>
    !reason ||
    !allowedCauses.has(reason.cause) ||
    typeof reason.title !== "string" ||
    typeof reason.text !== "string"
  );

  if (invalidReason) {
    return res.status(400).json({
      error: "Each reason needs a valid cause, title, and text",
    });
  }

  if (!Array.isArray(data.timeline) || !Array.isArray(data.sources)) {
    return res.status(400).json({
      error: "timeline and sources must be arrays",
    });
  }

  return next();
}

module.exports = { validateStartup };