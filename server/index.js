require("dotenv").config(); // Load .env before importing the database pool.


const express = require("express");
const prisma = require("./src/db/prisma");
const startupRouters = require("./src/modules/startups/startups.routes");
const feedRouters = require("./src/modules/feed/feed.routes");
const chatRouter = require("./src/modules/chat/chat.routes");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/chat", chatRouter);
app.use("/api/feed", feedRouters);
app.use("/api/startups", startupRouters);

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});


async function start(){
    try{
        await prisma.$connect();
        app.listen(port,()=>{
            console.log(`Server is running on port ${port}`);
        });
    }catch(error){
        console.error("Database connection failed:", error);  
        await prisma.$disconnect(); 
        process.exit(1); 
    }
}

start();