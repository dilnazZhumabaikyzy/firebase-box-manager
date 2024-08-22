import {IUser} from "@/models/IUser";
import {create} from "zustand";
import {login, logout, registration} from "@/services/AuthService";
import axios from "axios";
import {API_URL} from "@/http";
import {persist} from "zustand/middleware";

export interface UserState {
  user: IUser | null,
  isAuth: boolean,
}

export interface Error {
  location: string
  msg: string
  path: string
  type: string
  value: string
}

export type UserActions = {
  login: (phoneNumber: string, password: string) =>  Promise<any>
  registration: (name: string, phoneNumber: string, password: string) => Promise<any>
  checkAuth: () => void
  logout: (phoneNumber: any) => void
};

export type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      login: async (phoneNumber: string, password: string) => {
        try {
          const response = await login("7" + phoneNumber, password);
          localStorage.setItem("access", response.data.accessToken);
          localStorage.setItem("refresh", response.data.refreshToken);
          return null;
        } catch (e: any) {
          if (e.response?.status === 400 || e.response?.status === 401) {
            return e.response?.data?.message;
          }
          return "NetWork Error";
        }
      },
      registration: async (name: string, phoneNumber: string, password: string) => {
        try {
          const response = await registration(name,"7" + phoneNumber, password);

          console.log(response);
          set({user: response.data.user, isAuth: true});
          return [];
        } catch (e: any) {
          console.log(e);
          if (e.response?.status === 400 || e.response?.status === 401) {
            return e.response?.data?.message ? e.response?.data?.message : e.response.data.errors;
          }
          return "NetWork Error";
        }
      },
      logout: async (phoneNumber: string) => {
        try {
          const response = await logout("7" + phoneNumber);
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");

          console.log(response.data);
          set({user: null, isAuth: false});
        } catch (e: any) {
          console.log(e);
        }
      },
      checkAuth: async () => {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {},
            {withCredentials: true, headers: {Authorization: `Bearer ${localStorage.getItem("refresh")}`}});
          localStorage.setItem("access", response.data.accessToken);
          console.log(response.data);
          set({user: response.data.user, isAuth: true});
        } catch (e: any) {
          console.log(e.response?.data?.message);
          set({isAuth: false});
          window.location.replace("/login")
        }
      },
    }),
    {name: "user-store", skipHydration: true}
  )
)


