import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import useWalletHook from "../hooks/wallet.hook";

export type AuthContextType = {
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { account } = useWalletHook();
  const router = useRouter();

//   useEffect(() => {
//     if (!account) {
//       setIsAuthenticated(false);
//       router.push("/");
//     } else {
//       setIsAuthenticated(true);
//     }
//   }, [account]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthProvider() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useCounter must be used within an AuthProvider");
  }
  return context;
}
