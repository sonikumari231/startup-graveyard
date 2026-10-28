const { listApprovedFeedItems } = require("./feed.service");

async function getFeed(_req,res){
    try{
        const items = await listApprovedFeedItems();
        return res.status(200).json(items); 
    }catch(error) {
         console.error("Failed to fetch feed items:", error);
         return res.status(500).json({ error: "Unable to fetch feed items" });
    }
}

module.exports = { getFeed };