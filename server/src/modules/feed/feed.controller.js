const { listApprovedFeedItems, searchRecentShutdownReports, createFeedItemRecord } = require("./feed.service");

async function getFeed(_req,res){
    try{
        const items = await listApprovedFeedItems();
        return res.status(200).json(items); 
    }catch(error) {
         console.error("Failed to fetch feed items:", error);
         return res.status(500).json({ error: "Unable to fetch feed items" });
    }
}

async function getRecentReports(_req, res) {
    try {
        const result = await searchRecentShutdownReports();
        return res.status(200).json(result);
    } catch (error) {
        if (!error.suppressed) console.error("Failed to search recent shutdown reports:", error);
        const retryAfter = error.retryAt ? Math.max(1, Math.ceil((error.retryAt - Date.now()) / 1000)) : undefined;
        if (retryAfter) res.set("Retry-After", String(retryAfter));
        return res.status(error.status === 429 ? 429 : 502).json({
            error: "Recent shutdown reports are temporarily unavailable",
            ...(retryAfter ? { retryAfterSeconds: retryAfter } : {}),
        });
    }
}

async function createFeedItem(req, res) {
    try {
        const item = await createFeedItemRecord(req.body);
        return res.status(201).json(item);
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({ error: "A feed item with this id already exists" });
        }
        console.error("Failed to create feed item:", error);
        return res.status(500).json({ error: "Unable to create feed item" });
    }
}

module.exports = { getFeed, getRecentReports, createFeedItem };
