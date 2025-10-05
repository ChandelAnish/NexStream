'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '../../firebase/config'; // Import your auth instance
import LoadingScreen from '@/components/LoadingScreen';

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Public routes that don't require authentication
// const publicRoutes = ['/sign-in', '/sign-up', '/clinic-management/teleconsultation', '/clinic-management/teleconsultation/*'];
const publicRoutes = ['/sign-in', '/sign-up','/','/about'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // listener
    const unsubscribe = onAuthStateChanged(auth, (user) => { // This sets up a listener that runs whenever the user: Logs in, Logs out, Refreshes the page. This is how Firebase tells you whether a user is currently signed in. It gives you the user directly If someone is logged in.
    // console.log(user)
      setUser(user);
      setLoading(false);
      
      // Check if the current route is protected and redirect if necessary
      // const isPublicRoute = publicRoutes.includes(pathname || '');
      const isPublicRoute = publicRoutes.some((route) =>
        route.endsWith('/*')
          ? (pathname || '').startsWith(route.replace('/*', ''))
          : route === pathname
      );
      
      
      // console.log(isPublicRoute)
      // console.log(pathname)
      if (!user && !isPublicRoute) {
        // Redirect to login if user is not authenticated and trying to access a protected route
        router.push(`/sign-in?returnUrl=${encodeURIComponent(pathname || '')}`); // returnUrl — so we remember where they wanted to go, and can bring them back after login.
      }
      if(user && isPublicRoute){
        router.push(`/dashboard`);
      }
    });

    // Clean up subscription
    return () => unsubscribe(); //This cleans up the Firebase listener when the component unmounts, to avoid memory leaks or double calls.
  }, [pathname, router]);

  // Create the value for our context
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
  };

  if (!mounted) return null;
  console.log(user);

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}