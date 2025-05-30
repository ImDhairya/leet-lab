import axios from "axios";

export const axisoInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api/v1"
      : "/api/v1",
  withCredentials: true,
});


export const googleAxiosInstance = axios.create({
  baseURL: 'https://google?code'
})