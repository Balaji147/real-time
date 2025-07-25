import express from "express"
const app = express()
import dotenv from "dotenv"
import { updatePortfolioData } from "./services/dataLoader.js"
import fs from 'fs';


dotenv.config()
import cors from 'cors'

app.use(cors())
app.use(express.json())

//make keep alive in host
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Update data every 15 seconds automatically
setInterval(async () => {
  await updatePortfolioData()
}, 15000)

app.get("/", async (req, res) => {
  const portfolio = JSON.parse(fs.readFileSync('./portfolio_data.json', 'utf-8'));
  res.status(200).json({ "message": "Data fetched", portfolio: portfolio})
})

const port = process.env.PORT
app.listen(port, () => console.log("Connected Successfully at PORT", port))
