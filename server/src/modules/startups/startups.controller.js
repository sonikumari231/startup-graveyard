const { listApprovedStartups }  = require("./startups.service");
const  { createStartupRecord } = require("./startups.service");

async function getStartups(_req,res){
    try{
        const startups = await listApprovedStartups();
        return res.status(200).json(startups);
    } catch (error) {
       console.error("Failed to fetch startups:", error);
    return res.status(500).json({ error: "Unable to fetch startups" });
  }
}

async function createStartup(req, res) {
    try{
        const startup = await createStartupRecord(req.body);
        return res.status(201).json(startup);
    } catch (error) {
        console.error("Failed to create startup:", error);
        return res.status(500).json({ error: "Unable to create startup" });
    }
}

module.exports = { getStartups, createStartup };