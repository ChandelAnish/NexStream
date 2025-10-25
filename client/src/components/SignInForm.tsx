'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  AuthError
} from 'firebase/auth'
import { auth } from '../../firebase/config'
import { useRouter, useSearchParams  } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setEmail } from '@/store/userSlice'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface FormState {
  email: string;
  password: string;
}

export default function SignInForm() {
  const [form, setForm] = useState<FormState>({ email: '', password: '' })
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const router = useRouter()
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { email, password } = form
    
    if (!email || !password) {
      setError('Please enter email and password')
      setLoading(false)
      return
    }

    try {
      const authenticatedUser = await signInWithEmailAndPassword(auth, email, password)
      console.log(authenticatedUser.user)
      dispatch(setEmail(authenticatedUser.user.email || "priya.sharma@example.com")); 
      router.push(returnUrl ?? '/dashboard')
    } catch (err) {
      console.error(err)
      const authError = err as AuthError
      
      switch (authError.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address')
          break
        case 'auth/wrong-password':
          setError('Invalid password')
          break
        case 'auth/invalid-email':
          setError('Invalid email format')
          break
        case 'auth/invalid-credential':
          setError('Invalid email or password')
          break
        case 'auth/too-many-requests':
          setError('Too many failed login attempts. Please try again later')
          break
        case 'auth/user-disabled':
          setError('This account has been disabled')
          break
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection')
          break
        default:
          setError('Sign in failed. Please try again')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push(returnUrl ?? '/')
    } catch (err) {
      console.error(err)
      setError('Google sign-in failed')
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Gaming background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-cyan-500 rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-purple-500 rotate-12 animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 border border-pink-500 rotate-45 animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 border border-blue-500 rotate-12 animate-pulse"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glassmorphism container */}
        <div className="backdrop-blur-xl bg-gray-900/80 border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-50"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4 flex justify-center"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400">Sign in to start your gaming session</p>
            </div>

            {/* Error message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg text-center backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-6">
              {/* Email input */}
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-cyan-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-cyan-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Sign in button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loading ? "Signing In..." : "Sign In"}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-600"></div>
              <div className="px-4 text-sm text-gray-400">or</div>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            {/* Google sign in */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              className="w-full py-4 bg-gray-800/50 border border-gray-600 hover:border-gray-500 text-white font-medium rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-gray-700/50 backdrop-blur-sm"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </motion.button>

            {/* Sign up link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}