import axios from "axios";
import { AuthApi, AdminApi, UsersApi, ProfileApi } from "./generated";
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const instance = axios.create();

const getAccessToken = () => {
  const session = SecureStore.getItem("session");
  if (session) {
    if (!session) {
      return null;
    }
    return session;
  }
};

instance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = new AuthApi(undefined, BASE_URL, instance);
export const adminApi = new AdminApi(undefined, BASE_URL, instance);
export const usersApi = new UsersApi(undefined, BASE_URL, instance);
export const profileApi = new ProfileApi(undefined, BASE_URL, instance);
