const {answerChat} = require("./chat.service");
 
async function postChat(req, res) {
    const {message,history=[]} = req.body || {};

   if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "message must be a non-empty string" });
  }

  if(message.length>2000){
    return res.status(400).json({ error: "message is too long" });
  }

  if (
    !Array.isArray(history) ||
    history.length > 6 ||
    history.some(
      (item) =>
        !item ||
        !["user", "assistant"].includes(item.role) ||
        typeof item.content !== "string"
    )
){
    return res.status(400).json({
        error:"history must contain up to 6 valid messages",
    });
}

try {
    const result = await answerChat(message.trim(), history);
    return res.json(result);
  } catch (error) {
    console.error("Chat request failed:", error);
    return res.status(500).json({ error: "Unable to answer chat question" });
  }
}

module.exports = { postChat };