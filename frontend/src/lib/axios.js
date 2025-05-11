import axios from "axios";

export const axisoInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "devlopment"
      ? "http://localhost:8081/api/v1"
      : "/api/v1",
  withCredentials: true,
});
