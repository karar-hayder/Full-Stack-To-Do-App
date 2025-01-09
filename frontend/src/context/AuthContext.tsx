"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string;
  refreshToken: string;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/tokens", { method: "GET" });
        const tokenData = await response.json();
        if (response.ok && tokenData.accessToken && tokenData.refreshToken) {
          setAccessToken(tokenData.accessToken);
          setRefreshToken(tokenData.refreshToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuth();
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await fetch("/api/auth/tokens", { method: "POST" }); // Optional: Log out on server side
    setAccessToken("");
    setRefreshToken("");
    setIsAuthenticated(false);
  };

  const refreshTokens = async () => {
    try {
      const response = await fetch("/api/auth/tokens", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const newTokens = await response.json();
      if (response.ok) {
        setAccessToken(newTokens.accessToken);
        setRefreshToken(newTokens.refreshToken);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setAccessToken("");
        setRefreshToken("");
      }
    } catch (error) {
      console.error("Error refreshing tokens:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        refreshToken,
        login,
        logout,
        refreshTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
