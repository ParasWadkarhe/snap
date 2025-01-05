import { createContext, useState, useContext, useEffect } from "react";
import { IContextType, IUser } from "@/types";
import { getCurrentUser } from "@/lib/appwrite/api";
import { useNavigate } from "react-router-dom";

// Initial user state
export const INITIAL_USER: IUser = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

// Initial context state
const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
};

// Create the context
const AuthContext = createContext<IContextType>(INITIAL_STATE);

// AuthProvider component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  // Function to check the authenticated user
  const checkAuthUser = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl || "",
          bio: currentAccount.bio || "",
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in checkAuthUser:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (cookieFallback === "[]" || cookieFallback === null) {
      navigate("/sign-in");
    } else {
      checkAuthUser();
    }
  }, [navigate]);

  const value: IContextType = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// Custom hook to access AuthContext
export const useUserContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUserContext must be used within an AuthProvider");
  }
  return context;
};
