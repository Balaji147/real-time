# Real Time

A React-based portfolio management dashboard displaying stock data with live updates for the particular companies, fetched from Yahoo Finance and Google Finance.

## Features

- Displays portfolio data categorized by sectors
- Real-time updates every 15 seconds
- Displays key financial metrics: CMP, P/E Ratio, Gain/Loss, etc.
- Responsive and mobile-friendly design with Tailwind CSS

## Installation

1. Clone the repository:
     ```bash
     git clone https://github.com/Balaji147/real-time.git (Clone the repository)
     cd real-time (go inside real-time folder)
2. go inside backend folder in a terminal
     cd backend
3. install dependencies
     npm i
4. Run the development server
     nodemon app.js
5. Open another terminal and go inside frontend folder
     cd real-time
     cd frontend
6. Install dependencies of frontend
     npm i
7. Run npm start

# Usage
The app fetches portfolio data from the backend API /dashboard.

Displays portfolio summary and detailed rows.

It will automatically refresh and fetched latest portfolio data.

# Technologies Used
React
Tailwind CSS
Axios
Yahoo Finance API
Google Finance API
Cheerio (for web scraping)
Node.js (backend)
express.js

# Configuration
Backend should be running on http://localhost:4000/

API endpoints: /dashboard returns portfolio data

