import axios from "axios"
const rootUrlBackend = process.env.REACT_APP_BASE_URL

const API = axios.create({
    baseURL:rootUrlBackend
})

export const fetchPortfolioData = async () => {
  try {
    const res = await API.get('/dashboard');
    return res.data.portfolio;
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    return [];
  }
}
