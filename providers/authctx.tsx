/*
  Provider og hook for autentisering i SafeDrop.
  Håndterer innlogging, utlogging, opprettelse av bruker og brukerens "session".
  Gir komponentene enkel tilgang til auth-data.
*/

import { createUser, setUserDisplayName, signIn, signOut } from "@/api/authApi";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  signIn: (userEmail: string, password: string) => void;
  signOut: VoidFunction;
  createUser: (email: string, password: string, displayName: string) => void;
  userNameSession?: string | null;
  isLoading: boolean;
  user: User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook for å hente auth-data fra konteksten
// Kaster feil hvis den brukes uten AuthSessionProvider
export function useAuthSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error(
      "UseAuthSession must be used within an AuthContext Porivder"
    );
  }

  return value;
}

/*
  Hovedprovideren for auth
  Setter opp state for bruker, session og loading-status
  Lytter til Firebase state endringer og,
  styrer navigering til hovedside når session lastes inn
*/
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [userSession, setUserSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userAuthSession, setUserAuthSession] = useState<User | null>(null);

  const router = useRouter();

  // Lytter til endringer i Firebase auth state
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoading(true);
      if (user) {
        setUserSession(user.displayName);
        setUserAuthSession(user);
      } else {
        setUserSession(null);
        setUserAuthSession(null);
      }
      setIsLoading(false);
    });
  }, []);

  // Naviger til hovdside når session er lastet inn
  useEffect(() => {
    if (isLoading) return;
    router.replace("/");
  }, [isLoading, router, userSession]);

  return (
    <AuthContext
      value={{
        signIn: (userEmail: string, password: string) => {
          signIn(userEmail, password);
        },
        signOut: () => {
          signOut();
        },
        createUser: async (
          email: string,
          password: string,
          displayName: string
        ) => {
          const newUser = await createUser(email, password);
          if (newUser) {
            await setUserDisplayName(newUser, displayName);
            setUserSession(displayName);
          }
        },
        userNameSession: userSession,
        isLoading: isLoading,
        user: userAuthSession,
      }}
    >
      {children}
    </AuthContext>
  );
}