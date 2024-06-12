import {AxiosResponse} from "axios";
import $api from "@/http";

const getAllUsers = (): Promise<AxiosResponse<AxiosResponse>> => {
  return $api.get("/users")
};

export {getAllUsers} ;