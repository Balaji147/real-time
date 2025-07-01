import express from "express"
const app = express()
import dotenv from "dotenv"
import { updatePortfolioData } from "./services/dataLoader.js"
import fs from 'fs';
const portfolio = JSON.parse(fs.readFileSync('./portfolio_data.json', 'utf-8'));

dotenv.config()
import cors from 'cors'

app.use(cors())
app.use(express.json())

// Update data every 15 seconds automatically
setInterval(async () => {
  await updatePortfolioData()
}, 15000)

app.get("/", async (req, res) => {
  res.status(200).json({ "message": "Data fetched", portfolio: portfolio})
})

const port = process.env.PORT
app.listen(port, () => console.log("Connected Successfully at PORT", port))
