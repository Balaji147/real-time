import express from "express"
const app = express()
import dotenv from "dotenv"
import { updatePortfolioData, getPortfolioData } from "./services/dataLoader.js"
dotenv.config()
import cors from 'cors'

app.use(cors())
app.use(express.json())

// Update data every 15 seconds automatically
setInterval(async () => {
  await updatePortfolioData()
  console.log("Portfolio data refreshed")
}, 15000)

app.get("/dashboard", async (req, res) => {
  res.status(200).json({ "message": "Data fetched", portfolio: getPortfolioData() })
})

const port = process.env.PORT
app.listen(port, () => console.log("Connected Successfully at PORT", port))
