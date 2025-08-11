// src/api/auth.ts
import axios from 'axios';
import { log } from 'node:console';
const BackendUrl = import.meta.env.VITE_API_URL


axios.defaults.withCredentials = true; // 🔑 To send cookies

export const verifyToken = async () => {
  try {
    const res = await axios.get(`${BackendUrl}/auth/verifyToken`,{
            headers: {
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }
        });
  
    return res.data.user;
  } catch (err) {
    console.log("error: ", err);
    
    return null;
  }
};
