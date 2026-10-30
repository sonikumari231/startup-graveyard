const allowedCauses = new Set([
  "market", "cash", "cost", "product", "compete", "timing",
  "fraud", "scale", "legal", "focus", "growth", "model",
]);

function validateFeedItem(req, res, next) {
  const data = req.body;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return res.status(400).json({ error: "Request body must be a JSON object" });
  }

  const requiredText = ["name", "raised", "why", "sourceTitle", "sourceUrl"];
  const missing = requiredText.filter(
    (field) => typeof data[field] !== "string" || !data[field].trim()
  );
  if (missing.length) {
    return res.status(400).json({ error: "Missing required fields", fields: missing });
  }

  if (data.id !== undefined && (typeof data.id !== "string" || !data.id.trim())) {
    return res.status(400).json({ error: "id must be a non-empty string when provided" });
  }
  if (data.when !== undefined && typeof data.when !== "string") {
    return res.status(400).json({ error: "when must be a string" });
  }
  if (data.country !== undefined && typeof data.country !== "string") {
    return res.status(400).json({ error: "country must be a string" });
  }

  const validDate = typeof data.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data.date)
    && !Number.isNaN(Date.parse(`${data.date}T00:00:00.000Z`))
    && new Date(`${data.date}T00:00:00.000Z`).toISOString().slice(0, 10) === data.date;
  const validMonth = typeof data.month === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(data.month);
  if (data.date !== undefined && !validDate) {
    return res.status(400).json({ error: "date must use YYYY-MM-DD format" });
  }
  if (data.month !== undefined && !validMonth) {
    return res.status(400).json({ error: "month must use YYYY-MM format" });
  }
  if (!validDate && !validMonth) {
    return res.status(400).json({ error: "Provide either date (YYYY-MM-DD) or month (YYYY-MM)" });
  }

  if (!Array.isArray(data.causes) || data.causes.some((cause) => !allowedCauses.has(cause))) {
    return res.status(400).json({ error: "causes must be an array of valid cause keys" });
  }

  try {
    const sourceUrl = new URL(data.sourceUrl);
    if (!['http:', 'https:'].includes(sourceUrl.protocol)) throw new Error("Invalid protocol");
  } catch {
    return res.status(400).json({ error: "sourceUrl must be a valid HTTP or HTTPS URL" });
  }

  return next();
}

module.exports = { validateFeedItem };
