import axios, {AxiosResponse} from "axios";
import $api, {API_URL} from "@/http";
import {AuthResponse} from "@/models/response/AuthResponse";

const login = async (phoneNumber: string, password: string): Promise<AxiosResponse<AuthResponse>> => {
  return $api.post<AuthResponse>("/auth/login", {phoneNumber, password});
};

const registration = async (name: string, phoneNumber: string, password: string): Promise<AxiosResponse<AuthResponse>> => {
  return $api.post<AuthResponse>("/auth/register",
    {
      name: name,
      role: "user",
      phoneNumber: phoneNumber,
      receiveNotifications: false,
      password: password
    });
};

const logout = async (phoneNumber: string): Promise<AxiosResponse<AuthResponse>> => {
  return $api.post<AuthResponse>("/auth/logout", {phoneNumber: phoneNumber});
};

const checkAuth = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {}, {withCredentials: true});
    localStorage.setItem("access", response.data.accessToken);
  } catch (e: any) {
    console.log(e.response?.data?.message);
  }
}


export {login, registration, logout, checkAuth};