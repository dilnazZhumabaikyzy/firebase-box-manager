import axios, {AxiosResponse} from "axios";
import $api, {API_URL} from "@/http";
import {AuthResponse} from "@/models/response/AuthResponse";

const login = async (phoneNumber: string, password: string): Promise<AxiosResponse<AuthResponse>> => {
  return $api.post<AuthResponse>("/auth/login", {phoneNumber, password});
};

const registration = async (username:string, phoneNumber: string, password: string): Promise<AxiosResponse<AuthResponse>> => {
  return $api.post<AuthResponse>("/auth/register", {username, phoneNumber, password});
};

const logout = async (username:string): Promise<AxiosResponse<AuthResponse>> => {
  return $api.post<AuthResponse>("/auth/logout", {username});
};

const checkAuth = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {}, {withCredentials: true});
    localStorage.setItem("access", response.data.accessToken);
  } catch (e) {
    console.log(e.response?.data?.message);
  }
}



export {login, registration, logout, checkAuth};