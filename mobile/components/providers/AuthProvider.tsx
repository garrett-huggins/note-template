import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useContext, createContext } from "react";
import { profileApi, authApi } from "@/api";
import { ProfileEntity } from "@/api/generated";
import { useRouter, usePathname } from "expo-router";
import * as SecureStore from "expo-secure-store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export type AuthContextType = {
  user: ProfileEntity | null;
  login: (email: string, password: string) => Promise<boolean> | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => null,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<ProfileEntity | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const pathName = usePathname();

  const checkSession = async () => {
    console.log("Checking session");
    const session = await SecureStore.getItemAsync("session");
    if (session) {
      console.log("Session found");
      try {
        const response = await profileApi.profileControllerGetProfile();
        if (response.data) {
          setUser(response.data);
          setSession(session);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    } else {
      console.log("No session found");
      setUser(null);
      setSession(null);
    }
    if (!mounted) {
      setMounted(true);
    }
  };

  const login = async (email: string, password: string) => {
    console.log("Logging in", email, password);
    try {
      const response = await authApi.authControllerLogin({
        email,
        password,
      });
      console.log("Login success:");
      await SecureStore.setItemAsync("session", response.data.access_token);
      checkSession();
      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("session");
    setUser(null);
    setSession(null);
  };

  // Periodic token expiry check (adjust the interval as needed)
  useEffect(() => {
    console.log("Interval started");
    const intervalId = setInterval(() => {
      checkSession();
    }, 60000); // Check every minute, adjust as needed
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!mounted) {
      checkSession();
    }
    if (session) {
      if (
        pathName === "/login" ||
        pathName === "/password/forgot" ||
        pathName === "/password/reset" ||
        pathName === "/register"
      ) {
        router.push("/");
      }
    } else {
      if (pathName !== "/login") {
        router.push("/login");
      }
    }
  }, [session]);

  const value = {
    user,
    login,
    logout,
  };

  if (!mounted) SplashScreen.hideAsync();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
