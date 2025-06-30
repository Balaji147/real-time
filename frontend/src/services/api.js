import axios from "axios"

const API = axios.create({
    baseURL:"http://localhost:4000/"
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
